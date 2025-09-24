/*
    Copyright (c) 2025 Brett Morgan.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import { readdir, readFile } from "fs/promises";
import { resolve } from "path";

export class FileSystem {
    #path: string;

    constructor(path: string) {
        this.#path = resolve(path);
    }

    public async *list(): AsyncGenerator<string> {
        for (const file of await readdir(this.#path)) {
            yield file;
        }
    }

    public async get(name: string): Promise<{ text: () => Promise<string> }> {
        const path = resolve(this.#path, name);
        const content = await readFile(path);
        return {
            text: async () => content.toString(),
        };
    }
}
