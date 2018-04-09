/* @flow */

const hasOwnProperty: (v:string) => boolean = Object.prototype.hasOwnProperty;
const toString: () => string = Object.prototype.toString;

type SomeObject = {
  [string]: any 
};

type RestArray = Array<any>;

type ExtendType = ((boolean | SomeObject, ...RestArray) => SomeObject)

/**
 * Проверяет, что переданный объект является "плоским" (т.е. созданным с помощью "{}"
 * или "new object").
 */

const isPlainObject: any => boolean = function(obj) {
  if (toString.call(obj) !== '[object Object]') {
    return false;
  }
  const prototype: Object = Object.getPrototypeOf(obj);
  return prototype === null ||
    prototype === Object.prototype;
}


const extend: ExtendType = function(first, ...sources) {
  let target: SomeObject;
  let deep: boolean;
  let i: number;

    // Обрабатываем ситуацию глубокого копирования.
    if (typeof first === 'boolean') {
        deep = first;
        target = sources[0];
        i = 1;
    } else {
        target = first;
        deep = false;
        i = 0;
    }

    for (; i < sources.length; i++) {
        const obj = sources[i];
        if (!obj) {
            continue;
        }

        for (const key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                const val: SomeObject | Array<any> = obj[key];
                const isArray: boolean = val && Array.isArray(val);

                // Копируем "плоские" объекты и массивы рекурсивно.
                if (deep && val && (isPlainObject(val) || isArray)) {
                    const src = target[key];
                    let clone;
                    if (isArray) {
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[key] = extend(deep, clone, val);
                } else {
                    target[key] = val;
                }
            }
        }
    }

    return target;
}

const obj1 = {};
console.log('#1.BEFORE:', {});
const obj2 = { foo: { bar: true }, arr: [1, 2] };
const obj3 = { foo: { baz: true }, arr: [1, 3, 4] };

extend(true, obj1, obj2, obj3, null);

console.log('#1.AFTER:', obj1);
console.log('#2:', obj2);
console.log('#3:', obj3);
