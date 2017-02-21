module.exports = (hbs) => {
    var blocks = {};

    hbs.registerHelper("extend", function (name, context) {
        var block = blocks[name];
        if (!block) {
            block = blocks[name] = [];
        }
        // for older versions of handlebars, use block.push(context(this));
        block.push(context.fn(this));
    });

    hbs.registerHelper("block", function (name) {
        var val = (blocks[name] || []).join("\n");
        // clear the block
        blocks[name] = [];
        return val;
    });

    hbs.registerHelper("toUpper", (text) => {
        return text.toUpperCase();
    });

    hbs.registerHelper("toLower", (text) => {
        return text.toLowerCase();
    });
}
