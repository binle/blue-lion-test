export class MyEventEmitter {
  private mapFunctions: { [key: string]: Function[] } = {};

  on(name: string, func: Function) {
    if (!name) {
      return;
    }
    this.mapFunctions[name] = this.mapFunctions[name] || [];
    this.mapFunctions[name].push(func);
    return this.off.bind(this, name, func);
  }

  emit<T extends any>(name: string, data: T) {
    if (!name) {
      return;
    }
    for (const func of this.mapFunctions[name] || []) {
      func(data);
    }
  }

  off(name: string, removedFunc?: Function) {
    if (!name) {
      return;
    }
    this.mapFunctions[name] = this.mapFunctions[name] || [];
    if (removedFunc) {
      for (let index = 0; index < this.mapFunctions[name].length; index++) {
        const func = this.mapFunctions[name][index];
        if (func === removedFunc) {
          this.mapFunctions[name].splice(index, 1);
          break;
        }
      }
    } else {
      this.mapFunctions[name] = [];
    }
  }
}

const tempPreventMouseEvent = (callback: Function, event: React.MouseEvent) => {
  event.preventDefault();
  callback();
};

export const preventMouseEvent = (callback: Function) => {
  return tempPreventMouseEvent.bind(null, callback);
};

export const nonceFunction: any = () => {};
