import {
  PDFContext,
  PDFDict,
  PDFName,
  PDFNumber,
  PDFRawStream,
} from 'src/core';
import { mergeIntoTypedArray, toCharCode } from 'src/utils';

describe(`PDFRawStream`, () => {
  const context = new PDFContext();
  const dict = PDFDict.withContext(context);
  dict.set(PDFName.Length, PDFNumber.of(7));
  const data = new Uint8Array([12, 39, 92, 38, 38, 28, 49]);

  it(`can be constructed from PDFRawStream.of(...)`, () => {
    expect(PDFRawStream.of(dict, data)).toBeInstanceOf(PDFRawStream);
  });

  it(`can be cloned`, () => {
    const original = PDFRawStream.of(dict, data);
    const clone = original.clone();
    expect(clone).not.toBe(original);
    expect(clone.toString()).toEqual(original.toString());
  });

  it(`can be converted to a string`, () => {
    expect(String(PDFRawStream.of(dict, data))).toEqual(
      '<<\n/Length 7\n>>\nstream\n<7 bytes>\nendstream',
    );
  });

  it(`can provide its size in bytes`, () => {
    expect(PDFRawStream.of(dict, data).sizeInBytes()).toBe(40);
  });

  it(`can be serialized`, () => {
    const buffer = new Uint8Array(44).fill(toCharCode(' '));
    expect(PDFRawStream.of(dict, data).copyBytesInto(buffer, 3));
    expect(buffer).toEqual(
      mergeIntoTypedArray(
        '   <<\n/Length 7\n>>\nstream\n',
        data,
        '\nendstream ',
      ),
    );
  });
});
