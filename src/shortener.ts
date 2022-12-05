import { customAlphabet } from "nanoid";
import { Env } from ".";

export const isURL = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

class Shortener {
    constructor(private env: Env) {}

    async getData(id: string): Promise<string | null> {
        return await this.env.URLS.get(id);
    }

    async deleteURL(id: string): Promise<boolean> {
        try {
            await this.env.URLS.delete(id);
            return true;
        } catch (err) {
            return false;
        }
    }

    async storeURL(url: string): Promise<string | null> {
        if (!isURL(url)) return null;

        try {
            const generator = customAlphabet('abcdefghijklmnopqrstuvwxyz', 6);
            const id = generator();
            await this.env.URLS.put(id, url);
            return id;
        } catch (err) {
            return null;
        }
    }
}

export default Shortener;