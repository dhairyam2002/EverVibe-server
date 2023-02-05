"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.User = void 0;
var class_validator_1 = require("class-validator");
var typeorm_1 = require("typeorm");
var Comment_1 = require("./Comment");
var Post_1 = require("./Post");
var User = /** @class */ (function () {
    function User() {
    }
    User_1 = User;
    var User_1;
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        (0, class_validator_1.IsNotEmpty)({ message: 'id required' })
    ], User.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ unique: true, nullable: false }),
        (0, class_validator_1.IsNotEmpty)({ message: 'userName required' })
    ], User.prototype, "userName");
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        (0, class_validator_1.IsNotEmpty)({ message: 'name required' })
    ], User.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ unique: true, nullable: false }),
        (0, class_validator_1.IsNotEmpty)({ message: 'email required' }),
        (0, class_validator_1.IsEmail)({}, { message: 'Enter Valid email' })
    ], User.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)({ "default": null }),
        (0, class_validator_1.IsOptional)()
    ], User.prototype, "bio");
    __decorate([
        (0, typeorm_1.Column)({ "default": null })
    ], User.prototype, "gender");
    __decorate([
        (0, typeorm_1.Column)({ "default": null })
    ], User.prototype, "profile_image");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return User_1; }, function (user) { return user.followedBy; }),
        (0, typeorm_1.JoinTable)()
    ], User.prototype, "following");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return User_1; }, function (user) { return user.following; })
    ], User.prototype, "followedBy");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Post_1.Post; }, function (post) { return post.user; })
    ], User.prototype, "posts");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return Post_1.Post; }, function (post) { return post.likes; })
    ], User.prototype, "likes");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Comment_1.Comment; }, function (comment) { return comment.user; })
    ], User.prototype, "comments");
    User = User_1 = __decorate([
        (0, typeorm_1.Entity)()
    ], User);
    return User;
}());
exports.User = User;
