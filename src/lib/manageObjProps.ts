export function getPropsByPriority(obj: object, priorityKeys: string[]): string[] {
    const allKeys = Object.keys(obj);

    const priorityFirst = priorityKeys.filter(key => allKeys.includes(key));
    const remainingKeys = allKeys.filter(key => !priorityFirst.includes(key));

    return [...priorityFirst, ...remainingKeys];
}

export function reorderObjPropsByPriority<T extends object[]>(objArr: T, priorityKeys: string[], objKeyProp: string): T {
    const reorderedObj: T = [] as unknown as T;

    for (let i = 0; i < objArr.length; i++) {
        const obj = objArr[i];
        if (priorityKeys.includes(obj[objKeyProp as keyof typeof obj]))
            reorderedObj.push(obj);
    }

    for (let i = 0; i < objArr.length; i++) {
        const obj = objArr[i];
        if (!priorityKeys.includes(obj[objKeyProp as keyof typeof obj]))
            reorderedObj.push(obj);
    }

    return reorderedObj;
}

