import { SchemaLoader } from './schemaLoader';

export interface FixField {
    tag: string;
    tagName: string;
    value: string;
    enumName: string;
    description: string;
    isRepeatingGroup?: boolean;
    section: 'Header' | 'Body' | 'Tail';
    children?: FixField[][];
}

export class FixParser {
    private schemaLoader: SchemaLoader;
    private headerTags = new Set(['8', '9', '35', '49', '56', '34', '52', '122', '115', '128', '90', '91', '212', '213', '347', '369', '627', '628', '629', '630']);
    private tailTags = new Set(['10', '89', '93']);

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

            let section: 'Header' | 'Body' | 'Tail' = 'Body';
            if (this.headerTags.has(tag)) section = 'Header';
            else if (this.tailTags.has(tag)) section = 'Tail';

            const field: FixField = {
                tag,
                tagName: metadata?.name || 'Unknown',
                value,
                enumName: enumMetadata?.name || '',
                description: metadata?.description || '',
                section
            };

            // Heuristic for repeating groups: 
            if (field.tagName.startsWith('No') && !isNaN(parseInt(value))) {
                field.isRepeatingGroup = true;
                field.children = [];
                
                if (stack.length > 0) {
                    const currentGroup = stack[stack.length - 1];
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
