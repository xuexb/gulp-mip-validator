/**
 * @file 验证 MIP 规范的 gulp 插件
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

const through = require('through2');
const gutil = require('gulp-util');
const validator = require('mip-validator')();
const PluginError = gutil.PluginError;

/**
 * 插件名称
 * @const
 * @type {string}
 */
const PLUGIN_NAME = 'gulp-mip-validator';

exports.validate = options => {
    options = Object.assign({
        'throws': true
    }, options);

    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }
        else if (file.isStream()) {
            return this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
        }

        const content = file.contents.toString();
        const errors = validator.validate(content);

        errors.forEach(error => {
            gutil.log(`${file.relative}: ${gutil.colors.red(error.message || 'NULL')}`);
        });

        if (!errors.length) {
            gutil.log(`MIP HTML validation results: ${gutil.colors.green('pass')}`);
        }
        else if (options.throws) {
            return this.emit('error', new PluginError(PLUGIN_NAME, 'MIP HTML  validation results error, please see https://www.mipengine.org/doc/2-tech/2-validate-mip.html !'));
        }

        return callback(null, file);
    });
};
