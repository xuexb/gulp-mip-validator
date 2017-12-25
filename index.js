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
    let errorNumber = 0;

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

        errorNumber += errors.length;

        errors.forEach(error => {
            gutil.log(`${file.relative}: ${gutil.colors.red(error.message || 'NULL')}`);
        });

        if (!errors.length) {
            gutil.log(`MIP HTML validation results: ${file.relative} - ${gutil.colors.green('pass')}`);
        }

        return callback(null, file);
    }, function (callback) {
        if (errorNumber && options.throws) {
            return this.emit('error', new PluginError(PLUGIN_NAME, '验证 MIP HTML 规范失败, 请访问 https://www.mipengine.org/doc/2-tech/2-validate-mip.html 获得更多帮助!'));
        }

        return callback();
    });
};
