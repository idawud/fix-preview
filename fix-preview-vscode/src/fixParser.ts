import { SchemaLoader } from './schemaLoader';

export interface FixField {
    tag: string;
    tagName: string;
    value: string;
    enumName: string;
    description: string;
    isRepeatingGroup?: boolean;
    children?: FixField[][];
}

export class FixParser {
    private schemaLoader: SchemaLoader;

    constructor(schemaLoader: SchemaLoader) {
        this.schemaLoader = schemaLoader;
    }

    public parse(raw: string): FixField[] {
        const delimiter = this.detectDelimiter(raw);
        const parts = raw.split(delimiter).filter(p => p.includes('='));
        
        const fields: FixField[] = [];
        const stack: { noTag: string, entries: FixField[][], currentEntry: FixField[] | null }[] = [];

        for (const part of parts) {
            const [tag, value] = part.split('=');
            const metadata = this.schemaLoader.getField(tag);
            const enumMetadata = this.schemaLoader.getEnum(tag, value);

            const field: FixField = {
                tag,
                tagName: metadata?.name || 'Unknown',
                value,
                enumName: enumMetadata?.name || '',
                description: metadata?.description || ''
            };

            // Heuristic for repeating groups: 
            // 1. If tag name starts with "No" and type is NumInGroup (we don't have type here yet, but we can assume from name)
            // 2. If we are in a group and see the first tag of the group again, start new entry.
            // This is complex without full structural schema.
            // Simplified: If tag starts with "No", it's a group header.
            if (field.tagName.startsWith('No') && !isNaN(parseInt(value))) {
                field.isRepeatingGroup = true;
                field.children = [];
                fields.push(field);
                stack.push({ noTag: tag, entries: field.children, currentEntry: null });
                continue;
            }

            if (stack.length > 0) {
                const currentGroup = stack[stack.length - 1];
                // If we see a tag that is already in the current entry, start a new entry
                if (currentGroup.currentEntry && currentGroup.currentEntry.some(f => f.tag === tag)) {
                    currentGroup.currentEntry = [field];
                    currentGroup.entries.push(currentGroup.currentEntry);
                } else if (!currentGroup.currentEntry) {
                    currentGroup.currentEntry = [field];
                    currentGroup.entries.push(currentGroup.currentEntry);
                } else {
                    currentGroup.currentEntry.push(field);
                }
            } else {
                fields.push(field);
            }
        }

        return fields;
    }

    private detectDelimiter(raw: string): string {
        if (raw.includes('\x01')) {
            return '\x01';
        }
        if (raw.includes('|')) {
            return '|';
        }
        return '\x01'; // Default
    }
}
