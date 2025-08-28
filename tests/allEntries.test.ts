import { describe, it, expect } from 'vitest';
import { allEntries } from '../src/allEntries';

describe('allEntries', () => {
  it('gets own properties only, not inherited', () => {
    const parent = { inherited: 'value' };
    const child = Object.create(parent);
    child.own = 'property';
    
    const result = [...allEntries(child)];
    expect(result).toEqual([['own', 'property']]);
  });

  it('handles empty object', () => {
    const result = [...allEntries({})];
    expect(result).toEqual([]);
  });

  it('gets own properties only', () => {
    const parent = { b: 2 };
    const child = Object.create(parent);
    child.a = 1;
    
    const result = [...allEntries(child)];
    expect(result).toEqual([['a', 1]]);
  });

  it('handles object with no prototype', () => {
    const obj = Object.create(null);
    obj.test = 'value';
    
    const result = [...allEntries(obj)];
    expect(result).toEqual([['test', 'value']]);
  });

  it('only includes own properties, not from prototype chain', () => {
    const grandparent = { level3: 'grandparent' };
    const parent = Object.create(grandparent);
    parent.level2 = 'parent';
    const child = Object.create(parent);
    child.level1 = 'child';
    
    const result = [...allEntries(child)];
    expect(result).toEqual([['level1', 'child']]);
  });

  it('handles overridden properties', () => {
    const parent = { prop: 'parent value' };
    const child = Object.create(parent);
    child.prop = 'child value';
    
    const result = [...allEntries(child)];
    // Should only include the child's version, not the parent's
    const propEntries = result.filter(([key]) => key === 'prop');
    expect(propEntries).toHaveLength(1);
    expect(propEntries[0]).toEqual(['prop', 'child value']);
  });

  it('handles arrays', () => {
    const arr = ['a', 'b'];
    const result = [...allEntries(arr)];
    expect(result).toContainEqual([0, 'a']);
    expect(result).toContainEqual([1, 'b']);
  });

  it('includes non-enumerable properties using Reflect.ownKeys', () => {
    const obj = {} as any;
    Object.defineProperty(obj, 'nonEnum', {
      value: 'hidden',
      enumerable: false
    });
    obj.visible = 'shown';
    
    const result = [...allEntries(obj)];
    expect(result).toContainEqual(['visible', 'shown']);
    expect(result).toContainEqual(['nonEnum', 'hidden']);
  });
});