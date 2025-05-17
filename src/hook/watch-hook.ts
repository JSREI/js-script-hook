/**
 * 监控对象
 */
export class WatchHook {
    /**
     * 监控一个对象
     * @param object - 要监控的对象
     * @returns 代理后的对象
     */
    public watch<T extends object>(object: T): T {
        return new Proxy(object, {
            get(target: T, p: string | symbol): any {
                return target[p as keyof T];
            },
            set(target: T, p: string | symbol, value: any): boolean {
                target[p as keyof T] = value;
                return true;
            }
        });
    }
} 