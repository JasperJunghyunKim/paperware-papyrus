import { toStringify } from './util';

const LABEL = 'toStringify()';

describe('common - util 테스트', () => {
  it(`${LABEL} BigInt 테스트`, (): void => {
    expect(toStringify(1234n)).toEqual('"1234"');
  });

  it(`${LABEL} 배열 테스트`, (): void => {
    expect(toStringify(['a', 1, 2n])).toEqual('["a",1,"2"]');
  });

  it(`${LABEL} 배열 테스트(공백)`, (): void => {
    expect(toStringify(['a', 1, 2n], 2)).toEqual('[\n  "a",\n  1,\n  "2"\n]');
  });

  it(`${LABEL} 객체 테스트`, (): void => {
    expect(toStringify({ a: 'a', b: 1, c: { d: 2n } })).toEqual('{"a":"a","b":1,"c":{"d":"2"}}');
  });

  it(`${LABEL} string 테스트`, (): void => {
    expect(toStringify('')).toEqual('');
  });

  it(`${LABEL} number 테스트`, (): void => {
    expect(toStringify(1)).toEqual('1');
  });

  it(`${LABEL} boolean 테스트`, (): void => {
    expect(toStringify(false)).toEqual('false');
  });
});
