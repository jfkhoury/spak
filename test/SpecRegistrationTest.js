/*jshint expr: true */
import SpecRegistration from "../lib/di/SpecRegistration";
import SpecFromClass from "../lib/di/SpecFromClass";
import SpecFromFn from "../lib/di/SpecFromFn";
import SpecFromValue from "../lib/di/SpecFromValue";

// Begin sample modules
class Foo {
    static get inject() {
        return ["bar", "colors"];
    }
}
function createBar(colors) {
    return { colors };
}
createBar.inject = ["colors"];
var colors = ["red", "green", "blue"];

// End sample modules

describe("SpecRegistration", function () {
    describe("when created", () => {
        beforeEach(() => {
            this.specs = new SpecRegistration();
        });

        it("should implement SpecRegistration", () => {
            this.specs.should.respondTo("writeTo");
        });
    });

    describe("Creating a registration with the 3 base spec types", () => {
        beforeEach(() => {
            this.specs = new SpecRegistration(
                new SpecFromClass("foo", Foo),
                new SpecFromFn("bar", createBar),
                new SpecFromValue("colors", colors)
            );
            this.config = {};
            this.specs.writeTo(this.config);
        });

        it("should create a config with `foo` spec'd from class Foo", () => {
            this.config.should.have.property("foo");
            this.config.foo.should.eql({
                create: {
                    module: Foo,
                    args: [{ $ref: "bar" }, { $ref: "colors" }],
                    isConstructor: true
                }
            });
        });

        it("should create a config with `bar` spec'd from fn createBar", () => {
            this.config.should.have.property("bar");
            this.config.bar.should.eql({
                create: {
                    module: createBar,
                    args: [{ $ref: "colors" }],
                    isConstructor: false
                }
            });
        });

        it("should create a config with `colors` spec'd from colors array", () => {
            this.config.should.have.property("colors");
            this.config.colors.should.eql({
                literal: colors
            });
        });
    });
});
