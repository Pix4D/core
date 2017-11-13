import { TranslateParser, TranslateDefaultParser } from '../index';
describe('Parser', function () {
    var parser;
    beforeEach(function () {
        parser = new TranslateDefaultParser();
    });
    it('is defined', function () {
        expect(TranslateParser).toBeDefined();
        expect(parser instanceof TranslateParser).toBeTruthy();
    });
    it('should interpolate strings', function () {
        expect(parser.interpolate("This is a {{ key }}", { key: "value" })).toEqual("This is a value");
    });
    it('should interpolate strings with falsy values', function () {
        expect(parser.interpolate("This is a {{ key }}", { key: "" })).toEqual("This is a ");
        expect(parser.interpolate("This is a {{ key }}", { key: 0 })).toEqual("This is a 0");
    });
    it('should interpolate strings with object properties', function () {
        expect(parser.interpolate("This is a {{ key1.key2 }}", { key1: { key2: "value2" } })).toEqual("This is a value2");
        expect(parser.interpolate("This is a {{ key1.key2.key3 }}", { key1: { key2: { key3: "value3" } } })).toEqual("This is a value3");
    });
    it('should support interpolation functions', function () {
        expect(parser.interpolate(function (v) { return v.toUpperCase() + ' YOU!'; }, 'bless')).toBe('BLESS YOU!');
    });
    it('should get the addressed value', function () {
        expect(parser.getValue({ key1: { key2: "value2" } }, 'key1.key2')).toEqual("value2");
        expect(parser.getValue({ key1: { key2: "value" } }, 'keyWrong.key2')).not.toBeDefined();
        expect(parser.getValue({ key1: { key2: { key3: "value3" } } }, 'key1.key2.key3')).toEqual("value3");
        expect(parser.getValue({ key1: { key2: { key3: "value3" } } }, 'key1.keyWrong.key3')).not.toBeDefined();
        expect(parser.getValue({ key1: { key2: { key3: "value3" } } }, 'key1.key2.keyWrong')).not.toBeDefined();
        expect(parser.getValue({ 'key1.key2': { key3: "value3" } }, 'key1.key2.key3')).toEqual("value3");
        expect(parser.getValue({ key1: { 'key2.key3': "value3" } }, 'key1.key2.key3')).toEqual("value3");
        expect(parser.getValue({ 'key1.key2.key3': "value3" }, 'key1.key2.key3')).toEqual("value3");
        expect(parser.getValue({ 'key1.key2': { key3: "value3" } }, 'key1.key2.keyWrong')).not.toBeDefined();
        expect(parser.getValue({
            'key1': "value1",
            'key1.key2': "value2"
        }, 'key1.key2')).toEqual("value2");
    });
});
