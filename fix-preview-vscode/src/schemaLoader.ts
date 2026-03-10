import * as fs from 'fs';
import * as path from 'path';
import { XMLParser } from 'fast-xml-parser';

export interface FieldMetadata {
    tag: string;
    name: string;
    type: string;
    description: string;
}

export interface EnumMetadata {
    tag: string;
    value: string;
    name: string;
    description: string;
}

export class SchemaLoader {
    private fields: Map<string, FieldMetadata> = new Map();
    private enums: Map<string, Map<string, EnumMetadata>> = new Map();
    private schemaPath: string;
    private parser: XMLParser;

    constructor(schemaPath: string) {
        this.schemaPath = schemaPath;
        this.parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: ""
        });
    }

    public async loadVersion(version: string): Promise<void> {
        const versionDir = path.join(this.schemaPath, version, 'Base');
        if (!fs.existsSync(versionDir)) {
            console.error(`Version directory not found: ${versionDir}`);
            return;
        }

        const fieldsPath = path.join(versionDir, 'Fields.xml');
        const enumsPath = path.join(versionDir, 'Enums.xml');

        if (fs.existsSync(fieldsPath)) {
            const fieldsXml = fs.readFileSync(fieldsPath, 'utf8');
            this.parseFields(fieldsXml);
        }

        if (fs.existsSync(enumsPath)) {
            const enumsXml = fs.readFileSync(enumsPath, 'utf8');
            this.parseEnums(enumsXml);
        }
    }

    private parseFields(xml: string) {
        const jsonObj = this.parser.parse(xml);
        const fields = jsonObj.Fields.Field;
        if (Array.isArray(fields)) {
            for (const f of fields) {
                const tag = String(f.Tag);
                const name = String(f.Name);
                const type = String(f.Type || "");
                const description = String(f.Description || "");
                this.fields.set(tag, { tag, name, type, description });
            }
        }
    }

    private parseEnums(xml: string) {
        const jsonObj = this.parser.parse(xml);
        const enums = jsonObj.Enums.Enum;
        if (Array.isArray(enums)) {
            for (const e of enums) {
                const tag = String(e.Tag);
                const value = String(e.Value);
                const name = String(e.SymbolicName);
                const description = String(e.Description || "");
                if (!this.enums.has(tag)) {
                    this.enums.set(tag, new Map());
                }
                this.enums.get(tag)!.set(value, { tag, value, name, description });
            }
        }
    }

    public getField(tag: string): FieldMetadata | undefined {
        return this.fields.get(tag);
    }

    public getEnum(tag: string, value: string): EnumMetadata | undefined {
        return this.enums.get(tag)?.get(value);
    }
}
