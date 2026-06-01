/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiGatewayModule = void 0;
const common_1 = __webpack_require__(2);
const platform_express_1 = __webpack_require__(5);
const schedule_1 = __webpack_require__(6);
const api_gateway_controller_1 = __webpack_require__(7);
const api_gateway_service_1 = __webpack_require__(8);
const prisma_module_1 = __webpack_require__(9);
const auth_module_1 = __webpack_require__(12);
const tenant_module_1 = __webpack_require__(24);
const user_module_1 = __webpack_require__(28);
const member_module_1 = __webpack_require__(31);
const member_self_module_1 = __webpack_require__(40);
const member_voucher_module_1 = __webpack_require__(43);
const tier_module_1 = __webpack_require__(34);
const point_module_1 = __webpack_require__(37);
const campaign_module_1 = __webpack_require__(46);
const reward_module_1 = __webpack_require__(49);
const voucher_module_1 = __webpack_require__(52);
const promotion_module_1 = __webpack_require__(55);
const referral_module_1 = __webpack_require__(58);
const gamification_module_1 = __webpack_require__(61);
const dashboard_module_1 = __webpack_require__(64);
const upload_module_1 = __webpack_require__(67);
const analytics_module_1 = __webpack_require__(72);
const notification_module_1 = __webpack_require__(75);
const audit_log_module_1 = __webpack_require__(78);
let ApiGatewayModule = class ApiGatewayModule {
};
exports.ApiGatewayModule = ApiGatewayModule;
exports.ApiGatewayModule = ApiGatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({ dest: './uploads' }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            tenant_module_1.TenantModule,
            user_module_1.UserModule,
            member_module_1.MemberModule,
            member_self_module_1.MemberSelfModule,
            member_voucher_module_1.MemberVoucherModule,
            tier_module_1.TierModule,
            point_module_1.PointModule,
            campaign_module_1.CampaignModule,
            reward_module_1.RewardModule,
            voucher_module_1.VoucherModule,
            promotion_module_1.PromotionModule,
            referral_module_1.ReferralModule,
            gamification_module_1.GamificationModule,
            dashboard_module_1.DashboardModule,
            upload_module_1.UploadModule,
            analytics_module_1.AnalyticsModule,
            notification_module_1.NotificationModule,
            audit_log_module_1.AuditLogModule,
        ],
        controllers: [api_gateway_controller_1.ApiGatewayController],
        providers: [api_gateway_service_1.ApiGatewayService],
    })
], ApiGatewayModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiGatewayController = void 0;
const common_1 = __webpack_require__(2);
const api_gateway_service_1 = __webpack_require__(8);
let ApiGatewayController = class ApiGatewayController {
    apiGatewayService;
    constructor(apiGatewayService) {
        this.apiGatewayService = apiGatewayService;
    }
    getHello() {
        return this.apiGatewayService.getHello();
    }
};
exports.ApiGatewayController = ApiGatewayController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ApiGatewayController.prototype, "getHello", null);
exports.ApiGatewayController = ApiGatewayController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof api_gateway_service_1.ApiGatewayService !== "undefined" && api_gateway_service_1.ApiGatewayService) === "function" ? _a : Object])
], ApiGatewayController);


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiGatewayService = void 0;
const common_1 = __webpack_require__(2);
let ApiGatewayService = class ApiGatewayService {
    getHello() {
        return 'Hello World!';
    }
};
exports.ApiGatewayService = ApiGatewayService;
exports.ApiGatewayService = ApiGatewayService = __decorate([
    (0, common_1.Injectable)()
], ApiGatewayService);


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(2);
const client_1 = __webpack_require__(11);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(14);
const auth_service_1 = __webpack_require__(15);
const auth_controller_1 = __webpack_require__(17);
const jwt_strategy_1 = __webpack_require__(20);
const roles_guard_1 = __webpack_require__(22);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'loyalty_jwt_secret_key_change_in_production',
                signOptions: { expiresIn: (process.env.JWT_EXPIRATION || '24h') },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, roles_guard_1.RolesGuard],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule, roles_guard_1.RolesGuard],
    })
], AuthModule);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(13);
const crypto = __importStar(__webpack_require__(16));
const prisma_service_1 = __webpack_require__(10);
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }
    async registerHost(email, password, name) {
        const existing = await this.prisma.host.findUnique({ where: { email } });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const host = await this.prisma.host.create({
            data: { email, password: this.hashPassword(password), name },
        });
        return { id: host.id, email: host.email, name: host.name };
    }
    async loginHost(email, password) {
        const host = await this.prisma.host.findUnique({ where: { email } });
        if (!host || host.password !== this.hashPassword(password)) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateToken(host.id, host.email, 'HOST');
    }
    async loginTenant(email, password, tenantId) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== this.hashPassword(password)) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (tenantId && user.tenantId !== tenantId) {
            throw new common_1.UnauthorizedException('User does not belong to this tenant');
        }
        return this.generateToken(user.id, user.email, user.role, user.tenantId);
    }
    async loginMember(email, password) {
        const member = await this.prisma.member.findUnique({ where: { email } });
        if (!member)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (member.status !== 'ACTIVE')
            throw new common_1.UnauthorizedException('Account is not active');
        if (member.password && member.password !== this.hashPassword(password)) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateToken(member.id, member.email, 'MEMBER', member.tenantId);
    }
    generateToken(sub, email, role, tenantId) {
        const payload = { sub, email, role, tenantId };
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign({ sub, type: 'refresh' }, { expiresIn: '7d' }),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(15);
const common_dto_1 = __webpack_require__(18);
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    registerHost(body) {
        return this.authService.registerHost(body.email, body.password, body.name);
    }
    loginHost(body) {
        return this.authService.loginHost(body.email, body.password);
    }
    loginTenant(body) {
        return this.authService.loginTenant(body.email, body.password, body.tenantId);
    }
    loginMember(body) {
        return this.authService.loginMember(body.email, body.password);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('host/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new host (super admin)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof common_dto_1.RegisterHostDto !== "undefined" && common_dto_1.RegisterHostDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerHost", null);
__decorate([
    (0, common_1.Post)('host/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login as host' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof common_dto_1.LoginDto !== "undefined" && common_dto_1.LoginDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginHost", null);
__decorate([
    (0, common_1.Post)('tenant/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login as tenant admin/user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginTenant", null);
__decorate([
    (0, common_1.Post)('member/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login as member' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof common_dto_1.LoginDto !== "undefined" && common_dto_1.LoginDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginMember", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EarnPointsDto = exports.PaginationDto = exports.ValidateVoucherDto = exports.CreateVoucherDto = exports.RedeemRewardDto = exports.CreateRewardDto = exports.CreateCampaignDto = exports.CreateMemberDto = exports.CreateTenantDto = exports.RegisterHostDto = exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(19);
const swagger_1 = __webpack_require__(3);
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class RegisterHostDto {
    email;
    password;
    name;
}
exports.RegisterHostDto = RegisterHostDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'host@loyalty.vn' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterHostDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Host@123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterHostDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Platform Host' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterHostDto.prototype, "name", void 0);
class CreateTenantDto {
    name;
    domain;
    email;
    phone;
    address;
    hostId;
}
exports.CreateTenantDto = CreateTenantDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "hostId", void 0);
class CreateMemberDto {
    email;
    fullName;
    phone;
    tenantId;
    tierId;
}
exports.CreateMemberDto = CreateMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "tierId", void 0);
class CreateCampaignDto {
    name;
    description;
    startDate;
    endDate;
    budget;
    tenantId;
}
exports.CreateCampaignDto = CreateCampaignDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCampaignDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "tenantId", void 0);
class CreateRewardDto {
    name;
    description;
    type;
    pointsRequired;
    quantity;
    imageUrl;
    tenantId;
}
exports.CreateRewardDto = CreateRewardDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRewardDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRewardDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRewardDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRewardDto.prototype, "pointsRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRewardDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRewardDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRewardDto.prototype, "tenantId", void 0);
class RedeemRewardDto {
    memberId;
    quantity;
}
exports.RedeemRewardDto = RedeemRewardDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemRewardDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RedeemRewardDto.prototype, "quantity", void 0);
class CreateVoucherDto {
    code;
    type;
    value;
    maxUsage;
    expiresAt;
    tenantId;
}
exports.CreateVoucherDto = CreateVoucherDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateVoucherDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVoucherDto.prototype, "maxUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "tenantId", void 0);
class ValidateVoucherDto {
    code;
}
exports.ValidateVoucherDto = ValidateVoucherDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateVoucherDto.prototype, "code", void 0);
class PaginationDto {
    page;
    limit;
    search;
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaginationDto.prototype, "search", void 0);
class EarnPointsDto {
    memberId;
    amount;
    reason;
}
exports.EarnPointsDto = EarnPointsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EarnPointsDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EarnPointsDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EarnPointsDto.prototype, "reason", void 0);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(14);
const passport_jwt_1 = __webpack_require__(21);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'loyalty_jwt_secret_key_change_in_production',
        });
    }
    async validate(payload) {
        return { id: payload.sub, email: payload.email, role: payload.role, tenantId: payload.tenantId };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtStrategy);


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(1);
const roles_decorator_1 = __webpack_require__(23);
let RolesGuard = class RolesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0)
            return true;
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.includes(user?.role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(2);
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TenantModule = void 0;
const common_1 = __webpack_require__(2);
const tenant_service_1 = __webpack_require__(25);
const tenant_controller_1 = __webpack_require__(26);
let TenantModule = class TenantModule {
};
exports.TenantModule = TenantModule;
exports.TenantModule = TenantModule = __decorate([
    (0, common_1.Module)({
        controllers: [tenant_controller_1.TenantController],
        providers: [tenant_service_1.TenantService],
    })
], TenantModule);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TenantService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let TenantService = class TenantService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.tenant.findUnique({ where: { domain: data.domain } });
        if (existing)
            throw new common_1.ConflictException('Domain already exists');
        return this.prisma.tenant.create({
            data: { ...data, hostId: data.hostId },
        });
    }
    async findAll(page = 1, limit = 20, search) {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { domain: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ]
        } : {};
        const [data, total] = await Promise.all([
            this.prisma.tenant.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.tenant.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id }, include: { _count: { select: { users: true, members: true } } } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return tenant;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.tenant.update({ where: { id }, data: data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.tenant.update({ where: { id }, data: { status: 'DISABLED' } });
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], TenantService);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TenantController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const tenant_service_1 = __webpack_require__(25);
const jwt_auth_guard_1 = __webpack_require__(27);
let TenantController = class TenantController {
    tenantService;
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    create(body) {
        return this.tenantService.create(body);
    }
    findAll(page, limit, search) {
        return this.tenantService.findAll(page, limit, search);
    }
    findOne(id) {
        return this.tenantService.findOne(id);
    }
    update(id, body) {
        return this.tenantService.update(id, body);
    }
    remove(id) {
        return this.tenantService.remove(id);
    }
};
exports.TenantController = TenantController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tenant' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all tenants (with pagination)' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tenant' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete tenant (soft)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "remove", null);
exports.TenantController = TenantController = __decorate([
    (0, swagger_1.ApiTags)('Tenants'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('tenants'),
    __metadata("design:paramtypes", [typeof (_a = typeof tenant_service_1.TenantService !== "undefined" && tenant_service_1.TenantService) === "function" ? _a : Object])
], TenantController);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OptionalAuthGuard = exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(14);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
let OptionalAuthGuard = class OptionalAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader)
            return true;
        return super.canActivate(context);
    }
    handleRequest(err, user) {
        return user || null;
    }
};
exports.OptionalAuthGuard = OptionalAuthGuard;
exports.OptionalAuthGuard = OptionalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], OptionalAuthGuard);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const common_1 = __webpack_require__(2);
const user_service_1 = __webpack_require__(29);
const user_controller_1 = __webpack_require__(30);
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
    })
], UserModule);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const common_1 = __webpack_require__(2);
const crypto = __importStar(__webpack_require__(16));
const prisma_service_1 = __webpack_require__(10);
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }
    async create(data) {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            throw new common_1.ConflictException('Email already exists');
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: this.hashPassword(data.password),
                fullName: data.fullName,
                phone: data.phone,
                role: data.role || 'MEMBER',
                tenantId: data.tenantId,
            },
        });
    }
    async findAll(tenantId, page = 1, limit = 20, search) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.user.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.user.update({ where: { id }, data: data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UserService);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const user_service_1 = __webpack_require__(29);
const jwt_auth_guard_1 = __webpack_require__(27);
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    create(body) {
        return this.userService.create(body);
    }
    findAll(tenantId, page, limit, search) {
        return this.userService.findAll(tenantId, page, limit, search);
    }
    findOne(id) {
        return this.userService.findOne(id);
    }
    update(id, body) {
        return this.userService.update(id, body);
    }
    remove(id) {
        return this.userService.remove(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all users (with pagination)' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], UserController);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberModule = void 0;
const common_1 = __webpack_require__(2);
const member_service_1 = __webpack_require__(32);
const member_controller_1 = __webpack_require__(33);
const tier_module_1 = __webpack_require__(34);
const point_module_1 = __webpack_require__(37);
let MemberModule = class MemberModule {
};
exports.MemberModule = MemberModule;
exports.MemberModule = MemberModule = __decorate([
    (0, common_1.Module)({
        imports: [tier_module_1.TierModule, point_module_1.PointModule],
        controllers: [member_controller_1.MemberController],
        providers: [member_service_1.MemberService],
        exports: [member_service_1.MemberService],
    })
], MemberModule);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let MemberService = class MemberService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.member.findUnique({ where: { email: data.email } });
        if (existing)
            throw new common_1.ConflictException('Email already exists');
        return this.prisma.member.create({ data });
    }
    async findAll(tenantId, page = 1, limit = 20, search) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.member.findMany({
                where,
                include: { tier: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.member.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const member = await this.prisma.member.findUnique({
            where: { id },
            include: { tier: true, pointTransactions: { take: 20, orderBy: { createdAt: 'desc' } } },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        return member;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.member.update({ where: { id }, data: data });
    }
    async kycVerify(id) {
        await this.findOne(id);
        return this.prisma.member.update({
            where: { id },
            data: { kycVerified: true, status: 'ACTIVE' },
        });
    }
    async toggleStatus(id) {
        const member = await this.findOne(id);
        const newStatus = member.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
        return this.prisma.member.update({ where: { id }, data: { status: newStatus } });
    }
};
exports.MemberService = MemberService;
exports.MemberService = MemberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MemberService);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const member_service_1 = __webpack_require__(32);
const jwt_auth_guard_1 = __webpack_require__(27);
let MemberController = class MemberController {
    memberService;
    constructor(memberService) {
        this.memberService = memberService;
    }
    register(body) {
        return this.memberService.create(body);
    }
    create(body) {
        return this.memberService.create(body);
    }
    findAll(tenantId, page, limit, search) {
        return this.memberService.findAll(tenantId, page, limit, search);
    }
    findOne(id) {
        return this.memberService.findOne(id);
    }
    update(id, body) {
        return this.memberService.update(id, body);
    }
    kycVerify(id) {
        return this.memberService.kycVerify(id);
    }
    toggleStatus(id) {
        return this.memberService.toggleStatus(id);
    }
};
exports.MemberController = MemberController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Public member self-registration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "register", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: register a new member' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'List members (with pagination)' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get member by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update member' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/kyc'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Verify KYC for member' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "kycVerify", null);
__decorate([
    (0, common_1.Post)(':id/toggle-status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lock/Unlock member' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "toggleStatus", null);
exports.MemberController = MemberController = __decorate([
    (0, swagger_1.ApiTags)('Members'),
    (0, common_1.Controller)('members'),
    __metadata("design:paramtypes", [typeof (_a = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _a : Object])
], MemberController);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TierModule = void 0;
const common_1 = __webpack_require__(2);
const tier_service_1 = __webpack_require__(35);
const tier_controller_1 = __webpack_require__(36);
let TierModule = class TierModule {
};
exports.TierModule = TierModule;
exports.TierModule = TierModule = __decorate([
    (0, common_1.Module)({
        controllers: [tier_controller_1.TierController],
        providers: [tier_service_1.TierService],
        exports: [tier_service_1.TierService],
    })
], TierModule);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TierService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let TierService = class TierService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.tier.create({ data });
    }
    async findAll(tenantId, page = 1, limit = 20, search) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.tier.findMany({ where, orderBy: { minPoints: 'asc' }, skip, take: limit }),
            this.prisma.tier.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const tier = await this.prisma.tier.findUnique({ where: { id } });
        if (!tier)
            throw new common_1.NotFoundException('Tier not found');
        return tier;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.tier.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.tier.delete({ where: { id } });
    }
};
exports.TierService = TierService;
exports.TierService = TierService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], TierService);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TierController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const tier_service_1 = __webpack_require__(35);
const jwt_auth_guard_1 = __webpack_require__(27);
let TierController = class TierController {
    tierService;
    constructor(tierService) {
        this.tierService = tierService;
    }
    create(body) {
        return this.tierService.create(body);
    }
    findAll(tenantId, page, limit, search) {
        return this.tierService.findAll(tenantId, page, limit, search);
    }
    findOne(id) {
        return this.tierService.findOne(id);
    }
    update(id, body) {
        return this.tierService.update(id, body);
    }
    remove(id) {
        return this.tierService.remove(id);
    }
};
exports.TierController = TierController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a tier' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TierController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List tiers (with pagination)' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], TierController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tier by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TierController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tier' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TierController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete tier' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TierController.prototype, "remove", null);
exports.TierController = TierController = __decorate([
    (0, swagger_1.ApiTags)('Tiers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('tiers'),
    __metadata("design:paramtypes", [typeof (_a = typeof tier_service_1.TierService !== "undefined" && tier_service_1.TierService) === "function" ? _a : Object])
], TierController);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointModule = void 0;
const common_1 = __webpack_require__(2);
const point_service_1 = __webpack_require__(38);
const point_controller_1 = __webpack_require__(39);
let PointModule = class PointModule {
};
exports.PointModule = PointModule;
exports.PointModule = PointModule = __decorate([
    (0, common_1.Module)({
        controllers: [point_controller_1.PointController],
        providers: [point_service_1.PointService],
        exports: [point_service_1.PointService],
    })
], PointModule);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let PointService = class PointService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWallet(memberId) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        return {
            available: member.availablePoints,
            total: member.totalPoints,
            memberId: member.id,
        };
    }
    async earn(memberId, amount, reason) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const newTotal = member.totalPoints + amount;
        const [transaction] = await this.prisma.$transaction([
            this.prisma.pointTransaction.create({
                data: {
                    memberId,
                    type: 'EARN',
                    amount,
                    balance: member.availablePoints + amount,
                    reason,
                },
            }),
            this.prisma.member.update({
                where: { id: memberId },
                data: {
                    totalPoints: { increment: amount },
                    availablePoints: { increment: amount },
                },
            }),
        ]);
        await this.maybeUpgradeTier(memberId, member.tenantId, newTotal);
        return transaction;
    }
    async maybeUpgradeTier(memberId, tenantId, totalPoints) {
        const tiers = await this.prisma.tier.findMany({
            where: { tenantId, minPoints: { lte: totalPoints }, maxPoints: { gte: totalPoints } },
            orderBy: { minPoints: 'desc' },
            take: 1,
        });
        if (tiers.length > 0) {
            await this.prisma.member.update({
                where: { id: memberId },
                data: { tierId: tiers[0].id },
            });
        }
    }
    async burn(memberId, amount, reason) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (member.availablePoints < amount) {
            throw new Error('Insufficient points');
        }
        const [transaction] = await this.prisma.$transaction([
            this.prisma.pointTransaction.create({
                data: {
                    memberId,
                    type: 'BURN',
                    amount: -amount,
                    balance: member.availablePoints - amount,
                    reason,
                },
            }),
            this.prisma.member.update({
                where: { id: memberId },
                data: { availablePoints: { decrement: amount } },
            }),
        ]);
        return transaction;
    }
    getTransactions(memberId) {
        const where = memberId ? { memberId } : {};
        return this.prisma.pointTransaction.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
};
exports.PointService = PointService;
exports.PointService = PointService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PointService);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const point_service_1 = __webpack_require__(38);
const jwt_auth_guard_1 = __webpack_require__(27);
let PointController = class PointController {
    pointService;
    constructor(pointService) {
        this.pointService = pointService;
    }
    getWallet(memberId) {
        return this.pointService.getWallet(memberId);
    }
    earn(body) {
        return this.pointService.earn(body.memberId, body.amount, body.reason);
    }
    burn(body) {
        return this.pointService.burn(body.memberId, body.amount, body.reason);
    }
    getTransactions(memberId) {
        return this.pointService.getTransactions(memberId);
    }
};
exports.PointController = PointController;
__decorate([
    (0, common_1.Get)('wallet/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member point wallet' }),
    __param(0, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PointController.prototype, "getWallet", null);
__decorate([
    (0, common_1.Post)('earn'),
    (0, swagger_1.ApiOperation)({ summary: 'Earn points' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PointController.prototype, "earn", null);
__decorate([
    (0, common_1.Post)('burn'),
    (0, swagger_1.ApiOperation)({ summary: 'Burn points' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PointController.prototype, "burn", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'List point transactions' }),
    __param(0, (0, common_1.Query)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PointController.prototype, "getTransactions", null);
exports.PointController = PointController = __decorate([
    (0, swagger_1.ApiTags)('Points'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('points'),
    __metadata("design:paramtypes", [typeof (_a = typeof point_service_1.PointService !== "undefined" && point_service_1.PointService) === "function" ? _a : Object])
], PointController);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberSelfModule = void 0;
const common_1 = __webpack_require__(2);
const member_self_controller_1 = __webpack_require__(41);
const member_self_service_1 = __webpack_require__(42);
let MemberSelfModule = class MemberSelfModule {
};
exports.MemberSelfModule = MemberSelfModule;
exports.MemberSelfModule = MemberSelfModule = __decorate([
    (0, common_1.Module)({
        controllers: [member_self_controller_1.MemberSelfController],
        providers: [member_self_service_1.MemberSelfService],
        exports: [member_self_service_1.MemberSelfService],
    })
], MemberSelfModule);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberSelfController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const member_self_service_1 = __webpack_require__(42);
const jwt_auth_guard_1 = __webpack_require__(27);
let MemberSelfController = class MemberSelfController {
    memberSelfService;
    constructor(memberSelfService) {
        this.memberSelfService = memberSelfService;
    }
    getProfile(req) {
        return this.memberSelfService.getProfile(req.user.id);
    }
    getWallet(req) {
        return this.memberSelfService.getWallet(req.user.id);
    }
    setPassword(req, body) {
        return this.memberSelfService.setPassword(req.user.id, body.password);
    }
    changePassword(req, body) {
        return this.memberSelfService.changePassword(req.user.id, body.oldPassword, body.newPassword);
    }
    getBadges(req) {
        return this.memberSelfService.getBadges(req.user.id);
    }
    getReferrals(req) {
        return this.memberSelfService.getReferrals(req.user.id);
    }
    getVouchers(req) {
        return this.memberSelfService.getVouchers(req.user.id);
    }
};
exports.MemberSelfController = MemberSelfController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get own member profile' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('wallet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get own wallet (points + transactions)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getWallet", null);
__decorate([
    (0, common_1.Post)('set-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Set initial password' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "setPassword", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change own password' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('badges'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get own badges' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getBadges", null);
__decorate([
    (0, common_1.Get)('referrals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get own referral links and stats' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getReferrals", null);
__decorate([
    (0, common_1.Get)('vouchers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get own vouchers' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getVouchers", null);
exports.MemberSelfController = MemberSelfController = __decorate([
    (0, swagger_1.ApiTags)('Member Self-Service'),
    (0, common_1.Controller)('me'),
    __metadata("design:paramtypes", [typeof (_a = typeof member_self_service_1.MemberSelfService !== "undefined" && member_self_service_1.MemberSelfService) === "function" ? _a : Object])
], MemberSelfController);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberSelfService = void 0;
const common_1 = __webpack_require__(2);
const crypto = __importStar(__webpack_require__(16));
const prisma_service_1 = __webpack_require__(10);
let MemberSelfService = class MemberSelfService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }
    async getProfile(memberId) {
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
            include: { tier: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const { password, ...data } = member;
        return data;
    }
    async getWallet(memberId) {
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
            include: { tier: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const transactions = await this.prisma.pointTransaction.findMany({
            where: { memberId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return {
            id: member.id,
            email: member.email,
            fullName: member.fullName,
            tier: member.tier?.name || 'N/A',
            totalPoints: member.totalPoints,
            availablePoints: member.availablePoints,
            recentTransactions: transactions,
        };
    }
    async setPassword(memberId, password) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (member.password)
            throw new common_1.BadRequestException('Password already set. Use change-password instead.');
        await this.prisma.member.update({
            where: { id: memberId },
            data: { password: this.hashPassword(password) },
        });
        return { message: 'Password set successfully' };
    }
    async changePassword(memberId, oldPassword, newPassword) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (!member.password)
            throw new common_1.BadRequestException('No password set. Use set-password first.');
        if (member.password !== this.hashPassword(oldPassword)) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        await this.prisma.member.update({
            where: { id: memberId },
            data: { password: this.hashPassword(newPassword) },
        });
        return { message: 'Password changed successfully' };
    }
    async getBadges(memberId) {
        const badges = await this.prisma.badge.findMany({
            where: { tenant: { members: { some: { id: memberId } } } },
        });
        return badges;
    }
    async getReferrals(memberId) {
        const referrals = await this.prisma.referral.findMany({
            where: { referrerId: memberId },
            include: { referee: true },
            orderBy: { createdAt: 'desc' },
        });
        const total = referrals.length;
        const converted = referrals.filter(r => r.status === 'CONVERTED').length;
        return {
            referralCode: `REF-${memberId.slice(0, 8)}`,
            total,
            converted,
            rate: total > 0 ? ((converted / total) * 100).toFixed(1) : '0',
            referrals,
        };
    }
    async getVouchers(memberId) {
        const vouchers = await this.prisma.memberVoucher.findMany({
            where: { memberId },
            include: { voucher: true },
            orderBy: { createdAt: 'desc' },
        });
        return vouchers;
    }
};
exports.MemberSelfService = MemberSelfService;
exports.MemberSelfService = MemberSelfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MemberSelfService);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberVoucherModule = void 0;
const common_1 = __webpack_require__(2);
const member_voucher_controller_1 = __webpack_require__(44);
const member_voucher_service_1 = __webpack_require__(45);
let MemberVoucherModule = class MemberVoucherModule {
};
exports.MemberVoucherModule = MemberVoucherModule;
exports.MemberVoucherModule = MemberVoucherModule = __decorate([
    (0, common_1.Module)({
        controllers: [member_voucher_controller_1.MemberVoucherController],
        providers: [member_voucher_service_1.MemberVoucherService],
        exports: [member_voucher_service_1.MemberVoucherService],
    })
], MemberVoucherModule);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberVoucherController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const member_voucher_service_1 = __webpack_require__(45);
const jwt_auth_guard_1 = __webpack_require__(27);
let MemberVoucherController = class MemberVoucherController {
    memberVoucherService;
    constructor(memberVoucherService) {
        this.memberVoucherService = memberVoucherService;
    }
    assign(body) {
        return this.memberVoucherService.assign(body.memberId, body.voucherId);
    }
    findAll(memberId, page, limit) {
        return this.memberVoucherService.findAll(memberId, page, limit);
    }
    redeem(id) {
        return this.memberVoucherService.redeem(id);
    }
};
exports.MemberVoucherController = MemberVoucherController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Assign voucher to member' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberVoucherController.prototype, "assign", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List member-voucher assignments' }),
    __param(0, (0, common_1.Query)('memberId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], MemberVoucherController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':id/redeem'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem a member voucher' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberVoucherController.prototype, "redeem", null);
exports.MemberVoucherController = MemberVoucherController = __decorate([
    (0, swagger_1.ApiTags)('Member Vouchers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('member-vouchers'),
    __metadata("design:paramtypes", [typeof (_a = typeof member_voucher_service_1.MemberVoucherService !== "undefined" && member_voucher_service_1.MemberVoucherService) === "function" ? _a : Object])
], MemberVoucherController);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberVoucherService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let MemberVoucherService = class MemberVoucherService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assign(memberId, voucherId) {
        const existing = await this.prisma.memberVoucher.findFirst({
            where: { memberId, voucherId, redeemed: false },
        });
        if (existing)
            throw new common_1.ConflictException('Voucher already assigned to this member');
        return this.prisma.memberVoucher.create({
            data: { memberId, voucherId },
            include: { voucher: true, member: { select: { id: true, fullName: true, email: true } } },
        });
    }
    async findAll(memberId, page = 1, limit = 20) {
        const where = memberId ? { memberId } : {};
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.memberVoucher.findMany({
                where,
                include: { voucher: true, member: { select: { id: true, fullName: true, email: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.memberVoucher.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async redeem(id) {
        const mv = await this.prisma.memberVoucher.findUnique({ where: { id }, include: { voucher: true } });
        if (!mv)
            throw new common_1.NotFoundException('Assignment not found');
        if (mv.redeemed)
            throw new common_1.ConflictException('Voucher already redeemed');
        return this.prisma.memberVoucher.update({
            where: { id },
            data: { redeemed: true, redeemedAt: new Date() },
        });
    }
};
exports.MemberVoucherService = MemberVoucherService;
exports.MemberVoucherService = MemberVoucherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MemberVoucherService);


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampaignModule = void 0;
const common_1 = __webpack_require__(2);
const campaign_service_1 = __webpack_require__(47);
const campaign_controller_1 = __webpack_require__(48);
let CampaignModule = class CampaignModule {
};
exports.CampaignModule = CampaignModule;
exports.CampaignModule = CampaignModule = __decorate([
    (0, common_1.Module)({
        controllers: [campaign_controller_1.CampaignController],
        providers: [campaign_service_1.CampaignService],
    })
], CampaignModule);


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampaignService = void 0;
const common_1 = __webpack_require__(2);
const schedule_1 = __webpack_require__(6);
const prisma_service_1 = __webpack_require__(10);
let CampaignService = class CampaignService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.campaign.create({ data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) } });
    }
    async findAll(tenantId, page = 1, limit = 20, status, search) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.campaign.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.campaign.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id } });
        if (!campaign)
            throw new common_1.NotFoundException('Campaign not found');
        return campaign;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.campaign.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.campaign.delete({ where: { id } });
    }
    async autoExpireCampaigns() {
        const now = new Date();
        await this.prisma.campaign.updateMany({
            where: { endDate: { lt: now }, status: { not: 'ENDED' } },
            data: { status: 'ENDED' },
        });
        await this.prisma.campaign.updateMany({
            where: { startDate: { lte: now }, endDate: { gt: now }, status: { notIn: ['ACTIVE', 'ENDED'] } },
            data: { status: 'ACTIVE' },
        });
    }
};
exports.CampaignService = CampaignService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CampaignService.prototype, "autoExpireCampaigns", null);
exports.CampaignService = CampaignService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CampaignService);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampaignController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const campaign_service_1 = __webpack_require__(47);
const jwt_auth_guard_1 = __webpack_require__(27);
let CampaignController = class CampaignController {
    campaignService;
    constructor(campaignService) {
        this.campaignService = campaignService;
    }
    create(body) {
        return this.campaignService.create(body);
    }
    findAll(tenantId, page, limit, status, search) {
        return this.campaignService.findAll(tenantId, page, limit, status, search);
    }
    findOne(id) {
        return this.campaignService.findOne(id);
    }
    update(id, body) {
        return this.campaignService.update(id, body);
    }
    remove(id) {
        return this.campaignService.remove(id);
    }
};
exports.CampaignController = CampaignController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a campaign' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List campaigns (with pagination)' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update campaign' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete campaign' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "remove", null);
exports.CampaignController = CampaignController = __decorate([
    (0, swagger_1.ApiTags)('Campaigns'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('campaigns'),
    __metadata("design:paramtypes", [typeof (_a = typeof campaign_service_1.CampaignService !== "undefined" && campaign_service_1.CampaignService) === "function" ? _a : Object])
], CampaignController);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardModule = void 0;
const common_1 = __webpack_require__(2);
const reward_service_1 = __webpack_require__(50);
const reward_controller_1 = __webpack_require__(51);
let RewardModule = class RewardModule {
};
exports.RewardModule = RewardModule;
exports.RewardModule = RewardModule = __decorate([
    (0, common_1.Module)({
        controllers: [reward_controller_1.RewardController],
        providers: [reward_service_1.RewardService],
    })
], RewardModule);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let RewardService = class RewardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.reward.create({ data });
    }
    async findAll(tenantId, page = 1, limit = 20, search) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.reward.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.reward.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const reward = await this.prisma.reward.findUnique({ where: { id } });
        if (!reward)
            throw new common_1.NotFoundException('Reward not found');
        return reward;
    }
    async redeem(rewardId, memberId, quantity = 1) {
        const [reward, member] = await Promise.all([
            this.prisma.reward.findUnique({ where: { id: rewardId } }),
            this.prisma.member.findUnique({ where: { id: memberId } }),
        ]);
        if (!reward)
            throw new common_1.NotFoundException('Reward not found');
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (reward.quantity < quantity)
            throw new common_1.BadRequestException('Reward out of stock');
        const totalPoints = reward.pointsRequired * quantity;
        if (member.availablePoints < totalPoints)
            throw new common_1.BadRequestException('Insufficient points');
        const voucherCode = `RWD-${rewardId.slice(0, 6)}-${Date.now().toString(36).toUpperCase()}`;
        const [transaction] = await this.prisma.$transaction([
            this.prisma.pointTransaction.create({
                data: {
                    memberId,
                    type: 'BURN',
                    amount: -totalPoints,
                    balance: member.availablePoints - totalPoints,
                    reason: `Redeemed reward: ${reward.name} x${quantity}`,
                },
            }),
            this.prisma.member.update({
                where: { id: memberId },
                data: { availablePoints: { decrement: totalPoints } },
            }),
            this.prisma.reward.update({
                where: { id: rewardId },
                data: { quantity: { decrement: quantity } },
            }),
            this.prisma.voucher.create({
                data: {
                    code: voucherCode,
                    type: reward.type,
                    value: reward.pointsRequired,
                    tenantId: member.tenantId,
                    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                },
            }),
        ]);
        return { transaction, voucherCode, rewardName: reward.name, pointsUsed: totalPoints };
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.reward.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.reward.delete({ where: { id } });
    }
};
exports.RewardService = RewardService;
exports.RewardService = RewardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], RewardService);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const reward_service_1 = __webpack_require__(50);
const jwt_auth_guard_1 = __webpack_require__(27);
let RewardController = class RewardController {
    rewardService;
    constructor(rewardService) {
        this.rewardService = rewardService;
    }
    create(body) {
        return this.rewardService.create(body);
    }
    findAll(tenantId, page, limit, search) {
        return this.rewardService.findAll(tenantId, page, limit, search);
    }
    findOne(id) {
        return this.rewardService.findOne(id);
    }
    redeem(id, body) {
        return this.rewardService.redeem(id, body.memberId, body.quantity);
    }
    update(id, body) {
        return this.rewardService.update(id, body);
    }
    remove(id) {
        return this.rewardService.remove(id);
    }
};
exports.RewardController = RewardController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a reward' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RewardController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List rewards (with pagination)' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], RewardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reward by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RewardController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/redeem'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem reward with member points' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RewardController.prototype, "redeem", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update reward' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RewardController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete reward' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RewardController.prototype, "remove", null);
exports.RewardController = RewardController = __decorate([
    (0, swagger_1.ApiTags)('Rewards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('rewards'),
    __metadata("design:paramtypes", [typeof (_a = typeof reward_service_1.RewardService !== "undefined" && reward_service_1.RewardService) === "function" ? _a : Object])
], RewardController);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VoucherModule = void 0;
const common_1 = __webpack_require__(2);
const voucher_service_1 = __webpack_require__(53);
const voucher_controller_1 = __webpack_require__(54);
let VoucherModule = class VoucherModule {
};
exports.VoucherModule = VoucherModule;
exports.VoucherModule = VoucherModule = __decorate([
    (0, common_1.Module)({
        controllers: [voucher_controller_1.VoucherController],
        providers: [voucher_service_1.VoucherService],
    })
], VoucherModule);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VoucherService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let VoucherService = class VoucherService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.voucher.findUnique({ where: { code: data.code } });
        if (existing)
            throw new common_1.ConflictException('Voucher code already exists');
        return this.prisma.voucher.create({
            data: { ...data, expiresAt: data.expiresAt ? new Date(data.expiresAt) : null },
        });
    }
    async findAll(tenantId, page = 1, limit = 20, search) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { type: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.voucher.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.voucher.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const voucher = await this.prisma.voucher.findUnique({ where: { id } });
        if (!voucher)
            throw new common_1.NotFoundException('Voucher not found');
        return voucher;
    }
    async validate(code) {
        const voucher = await this.prisma.voucher.findUnique({ where: { code } });
        if (!voucher)
            throw new common_1.NotFoundException('Voucher not found');
        if (voucher.expiresAt && voucher.expiresAt < new Date())
            throw new common_1.BadRequestException('Voucher expired');
        if (voucher.maxUsage && voucher.usedCount >= voucher.maxUsage)
            throw new common_1.BadRequestException('Voucher usage limit reached');
        return { valid: true, voucher };
    }
    async redeem(id) {
        const voucher = await this.findOne(id);
        if (voucher.expiresAt && voucher.expiresAt < new Date())
            throw new common_1.BadRequestException('Voucher expired');
        if (voucher.maxUsage && voucher.usedCount >= voucher.maxUsage)
            throw new common_1.BadRequestException('Voucher usage limit reached');
        return this.prisma.voucher.update({
            where: { id },
            data: { usedCount: { increment: 1 } },
        });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.voucher.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.voucher.delete({ where: { id } });
    }
};
exports.VoucherService = VoucherService;
exports.VoucherService = VoucherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], VoucherService);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VoucherController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const voucher_service_1 = __webpack_require__(53);
const jwt_auth_guard_1 = __webpack_require__(27);
let VoucherController = class VoucherController {
    voucherService;
    constructor(voucherService) {
        this.voucherService = voucherService;
    }
    create(body) {
        return this.voucherService.create(body);
    }
    findAll(tenantId, page, limit, search) {
        return this.voucherService.findAll(tenantId, page, limit, search);
    }
    findOne(id) {
        return this.voucherService.findOne(id);
    }
    validate(body) {
        return this.voucherService.validate(body.code);
    }
    redeem(id) {
        return this.voucherService.redeem(id);
    }
    update(id, body) {
        return this.voucherService.update(id, body);
    }
    remove(id) {
        return this.voucherService.remove(id);
    }
};
exports.VoucherController = VoucherController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a voucher' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List vouchers (with pagination)' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get voucher by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate a voucher code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)(':id/redeem'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem/use a voucher' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "redeem", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update voucher' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete voucher' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "remove", null);
exports.VoucherController = VoucherController = __decorate([
    (0, swagger_1.ApiTags)('Vouchers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('vouchers'),
    __metadata("design:paramtypes", [typeof (_a = typeof voucher_service_1.VoucherService !== "undefined" && voucher_service_1.VoucherService) === "function" ? _a : Object])
], VoucherController);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromotionModule = void 0;
const common_1 = __webpack_require__(2);
const promotion_service_1 = __webpack_require__(56);
const promotion_controller_1 = __webpack_require__(57);
let PromotionModule = class PromotionModule {
};
exports.PromotionModule = PromotionModule;
exports.PromotionModule = PromotionModule = __decorate([
    (0, common_1.Module)({
        controllers: [promotion_controller_1.PromotionController],
        providers: [promotion_service_1.PromotionService],
    })
], PromotionModule);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromotionService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let PromotionService = class PromotionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.promotion.create({ data });
    }
    async findAll(tenantId, page = 1, limit = 20, search) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.promotion.findMany({ where, orderBy: { priority: 'asc' }, skip, take: limit }),
            this.prisma.promotion.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const promotion = await this.prisma.promotion.findUnique({ where: { id } });
        if (!promotion)
            throw new common_1.NotFoundException('Promotion not found');
        return promotion;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.promotion.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.promotion.delete({ where: { id } });
    }
};
exports.PromotionService = PromotionService;
exports.PromotionService = PromotionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PromotionService);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromotionController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const promotion_service_1 = __webpack_require__(56);
const jwt_auth_guard_1 = __webpack_require__(27);
let PromotionController = class PromotionController {
    promotionService;
    constructor(promotionService) {
        this.promotionService = promotionService;
    }
    create(body) {
        return this.promotionService.create(body);
    }
    findAll(tenantId, page, limit, search) {
        return this.promotionService.findAll(tenantId, page, limit, search);
    }
    findOne(id) {
        return this.promotionService.findOne(id);
    }
    update(id, body) {
        return this.promotionService.update(id, body);
    }
    remove(id) {
        return this.promotionService.remove(id);
    }
};
exports.PromotionController = PromotionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a promotion rule' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PromotionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List promotion rules (with pagination)' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], PromotionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get promotion rule' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromotionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update promotion rule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PromotionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete promotion rule' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromotionController.prototype, "remove", null);
exports.PromotionController = PromotionController = __decorate([
    (0, swagger_1.ApiTags)('Promotions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('promotions'),
    __metadata("design:paramtypes", [typeof (_a = typeof promotion_service_1.PromotionService !== "undefined" && promotion_service_1.PromotionService) === "function" ? _a : Object])
], PromotionController);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReferralModule = void 0;
const common_1 = __webpack_require__(2);
const referral_service_1 = __webpack_require__(59);
const referral_controller_1 = __webpack_require__(60);
let ReferralModule = class ReferralModule {
};
exports.ReferralModule = ReferralModule;
exports.ReferralModule = ReferralModule = __decorate([
    (0, common_1.Module)({
        controllers: [referral_controller_1.ReferralController],
        providers: [referral_service_1.ReferralService],
    })
], ReferralModule);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReferralService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let ReferralService = class ReferralService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLink(referrerId, tenantId) {
        const code = `REF-${referrerId.slice(0, 8)}-${Date.now().toString(36)}`;
        return this.prisma.referral.create({
            data: { code, referrerId, tenantId },
        });
    }
    async findAll(tenantId, page = 1, limit = 20, search) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.referral.findMany({
                where,
                include: { referrer: true, referee: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.referral.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getStats(tenantId) {
        const where = tenantId ? { tenantId } : {};
        const total = await this.prisma.referral.count({ where });
        const converted = await this.prisma.referral.count({ where: { ...where, status: 'CONVERTED' } });
        return { total, converted, rate: total > 0 ? (converted / total * 100).toFixed(1) : '0' };
    }
    async convertReferral(referralId, refereeId) {
        const referral = await this.prisma.referral.findUnique({ where: { id: referralId } });
        if (!referral)
            throw new common_1.NotFoundException('Referral not found');
        const updated = await this.prisma.referral.update({
            where: { id: referralId },
            data: { status: 'CONVERTED', refereeId, rewardGiven: false },
        });
        const rewardPoints = 500;
        await this.prisma.$transaction([
            this.prisma.pointTransaction.create({
                data: {
                    memberId: referral.referrerId,
                    type: 'EARN',
                    amount: rewardPoints,
                    balance: 0,
                    reason: `Referral reward: ${refereeId.slice(0, 8)} joined`,
                },
            }),
            this.prisma.member.update({
                where: { id: referral.referrerId },
                data: {
                    totalPoints: { increment: rewardPoints },
                    availablePoints: { increment: rewardPoints },
                },
            }),
            this.prisma.referral.update({
                where: { id: referralId },
                data: { rewardGiven: true },
            }),
        ]);
        return updated;
    }
};
exports.ReferralService = ReferralService;
exports.ReferralService = ReferralService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ReferralService);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReferralController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const referral_service_1 = __webpack_require__(59);
const jwt_auth_guard_1 = __webpack_require__(27);
let ReferralController = class ReferralController {
    referralService;
    constructor(referralService) {
        this.referralService = referralService;
    }
    createLink(_, referrerId, tenantId) {
        return this.referralService.createLink(referrerId, tenantId);
    }
    findAll(tenantId, page, limit, search) {
        return this.referralService.findAll(tenantId, page, limit, search);
    }
    getStats(tenantId) {
        return this.referralService.getStats(tenantId);
    }
    convert(id, body) {
        return this.referralService.convertReferral(id, body.refereeId);
    }
};
exports.ReferralController = ReferralController;
__decorate([
    (0, common_1.Post)('links'),
    (0, swagger_1.ApiOperation)({ summary: 'Create referral link' }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)('referrerId')),
    __param(2, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "createLink", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List referrals (with pagination)' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get referral stats' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)(':id/convert'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark referral as converted and reward referrer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "convert", null);
exports.ReferralController = ReferralController = __decorate([
    (0, swagger_1.ApiTags)('Referrals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('referrals'),
    __metadata("design:paramtypes", [typeof (_a = typeof referral_service_1.ReferralService !== "undefined" && referral_service_1.ReferralService) === "function" ? _a : Object])
], ReferralController);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamificationModule = void 0;
const common_1 = __webpack_require__(2);
const gamification_service_1 = __webpack_require__(62);
const gamification_controller_1 = __webpack_require__(63);
let GamificationModule = class GamificationModule {
};
exports.GamificationModule = GamificationModule;
exports.GamificationModule = GamificationModule = __decorate([
    (0, common_1.Module)({
        controllers: [gamification_controller_1.GamificationController],
        providers: [gamification_service_1.GamificationService],
    })
], GamificationModule);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamificationService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let GamificationService = class GamificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    createBadge(data) {
        return this.prisma.badge.create({ data });
    }
    async findAllBadges(tenantId, page = 1, limit = 20, search) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.badge.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.badge.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async updateBadge(id, data) {
        await this.findBadge(id);
        return this.prisma.badge.update({ where: { id }, data });
    }
    async removeBadge(id) {
        await this.findBadge(id);
        return this.prisma.badge.delete({ where: { id } });
    }
    async findBadge(id) {
        const badge = await this.prisma.badge.findUnique({ where: { id } });
        if (!badge)
            throw new common_1.NotFoundException('Badge not found');
        return badge;
    }
    createMission(data) {
        return this.prisma.mission.create({
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
            },
        });
    }
    async findAllMissions(tenantId, page = 1, limit = 20, search) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.mission.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.mission.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async updateMission(id, data) {
        const mission = await this.prisma.mission.findUnique({ where: { id } });
        if (!mission)
            throw new common_1.NotFoundException('Mission not found');
        return this.prisma.mission.update({ where: { id }, data });
    }
    async removeMission(id) {
        const mission = await this.prisma.mission.findUnique({ where: { id } });
        if (!mission)
            throw new common_1.NotFoundException('Mission not found');
        return this.prisma.mission.delete({ where: { id } });
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], GamificationService);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamificationController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const gamification_service_1 = __webpack_require__(62);
const jwt_auth_guard_1 = __webpack_require__(27);
let GamificationController = class GamificationController {
    gamificationService;
    constructor(gamificationService) {
        this.gamificationService = gamificationService;
    }
    createBadge(body) {
        return this.gamificationService.createBadge(body);
    }
    findAllBadges(tenantId, page, limit, search) {
        return this.gamificationService.findAllBadges(tenantId, page, limit, search);
    }
    updateBadge(id, body) {
        return this.gamificationService.updateBadge(id, body);
    }
    removeBadge(id) {
        return this.gamificationService.removeBadge(id);
    }
    createMission(body) {
        return this.gamificationService.createMission(body);
    }
    findAllMissions(tenantId, page, limit, search) {
        return this.gamificationService.findAllMissions(tenantId, page, limit, search);
    }
    updateMission(id, body) {
        return this.gamificationService.updateMission(id, body);
    }
    removeMission(id) {
        return this.gamificationService.removeMission(id);
    }
};
exports.GamificationController = GamificationController;
__decorate([
    (0, common_1.Post)('badges'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a badge' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "createBadge", null);
__decorate([
    (0, common_1.Get)('badges'),
    (0, swagger_1.ApiOperation)({ summary: 'List badges (with pagination)' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "findAllBadges", null);
__decorate([
    (0, common_1.Put)('badges/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update badge' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "updateBadge", null);
__decorate([
    (0, common_1.Delete)('badges/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete badge' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "removeBadge", null);
__decorate([
    (0, common_1.Post)('missions'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a mission' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "createMission", null);
__decorate([
    (0, common_1.Get)('missions'),
    (0, swagger_1.ApiOperation)({ summary: 'List missions (with pagination)' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "findAllMissions", null);
__decorate([
    (0, common_1.Put)('missions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update mission' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "updateMission", null);
__decorate([
    (0, common_1.Delete)('missions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete mission' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "removeMission", null);
exports.GamificationController = GamificationController = __decorate([
    (0, swagger_1.ApiTags)('Gamification'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof gamification_service_1.GamificationService !== "undefined" && gamification_service_1.GamificationService) === "function" ? _a : Object])
], GamificationController);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardModule = void 0;
const common_1 = __webpack_require__(2);
const dashboard_service_1 = __webpack_require__(65);
const dashboard_controller_1 = __webpack_require__(66);
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
    })
], DashboardModule);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats(tenantId) {
        const tenantFilter = tenantId ? { tenantId } : {};
        const [tenants, members, activeCampaigns, rewards, vouchers, totalPoints, promotions, badges, missions, referrals, tiersWithMembers,] = await Promise.all([
            this.prisma.tenant.count(),
            this.prisma.member.count({ where: tenantId ? { tenantId } : {} }),
            this.prisma.campaign.count({ where: { ...tenantFilter, status: 'ACTIVE' } }),
            this.prisma.reward.count({ where: tenantFilter }),
            this.prisma.voucher.count({ where: tenantFilter }),
            this.prisma.member.aggregate({ where: tenantFilter, _sum: { totalPoints: true } }),
            this.prisma.promotion.count({ where: tenantFilter }),
            this.prisma.badge.count({ where: tenantFilter }),
            this.prisma.mission.count({ where: tenantFilter }),
            this.prisma.referral.count({ where: tenantFilter }),
            this.prisma.tier.findMany({
                where: tenantFilter,
                include: { _count: { select: { members: true } } },
                orderBy: { minPoints: 'asc' },
            }),
        ]);
        return {
            tenants,
            members,
            activeCampaigns,
            rewards,
            vouchers,
            totalPoints: totalPoints._sum.totalPoints || 0,
            promotions,
            badges,
            missions,
            referrals,
            tiers: tiersWithMembers.map(t => ({ name: t.name, color: t.color, memberCount: t._count.members })),
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], DashboardService);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const dashboard_service_1 = __webpack_require__(65);
const jwt_auth_guard_1 = __webpack_require__(27);
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getStats(tenantId) {
        return this.dashboardService.getStats(tenantId);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard stats' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getStats", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [typeof (_a = typeof dashboard_service_1.DashboardService !== "undefined" && dashboard_service_1.DashboardService) === "function" ? _a : Object])
], DashboardController);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadModule = void 0;
const common_1 = __webpack_require__(2);
const upload_controller_1 = __webpack_require__(68);
const upload_service_1 = __webpack_require__(69);
let UploadModule = class UploadModule {
};
exports.UploadModule = UploadModule;
exports.UploadModule = UploadModule = __decorate([
    (0, common_1.Module)({
        controllers: [upload_controller_1.UploadController],
        providers: [upload_service_1.UploadService],
        exports: [upload_service_1.UploadService],
    })
], UploadModule);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const platform_express_1 = __webpack_require__(5);
const jwt_auth_guard_1 = __webpack_require__(27);
const upload_service_1 = __webpack_require__(69);
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadFile(file) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        return this.uploadService.upload(file);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a file (image, document)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: { file: { type: 'string', format: 'binary' } },
        },
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [typeof (_a = typeof upload_service_1.UploadService !== "undefined" && upload_service_1.UploadService) === "function" ? _a : Object])
], UploadController);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadService = void 0;
const common_1 = __webpack_require__(2);
const fs = __importStar(__webpack_require__(70));
const path = __importStar(__webpack_require__(71));
let UploadService = class UploadService {
    uploadDir = path.join(process.cwd(), 'uploads');
    constructor() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async upload(file) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(this.uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        return {
            url: `/uploads/${fileName}`,
            fileName,
            size: file.size,
            mimetype: file.mimetype,
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);


/***/ }),
/* 70 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 71 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsModule = void 0;
const common_1 = __webpack_require__(2);
const analytics_controller_1 = __webpack_require__(73);
const analytics_service_1 = __webpack_require__(74);
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [analytics_service_1.AnalyticsService],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const analytics_service_1 = __webpack_require__(74);
const jwt_auth_guard_1 = __webpack_require__(27);
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    getPointsTrend(days, tenantId) {
        return this.analyticsService.getPointsTrend(days || 30, tenantId);
    }
    getMemberGrowth(days, tenantId) {
        return this.analyticsService.getMemberGrowth(days || 30, tenantId);
    }
    getCampaignPerformance(tenantId) {
        return this.analyticsService.getCampaignPerformance(tenantId);
    }
    getTopMembers(limit, tenantId) {
        return this.analyticsService.getTopMembers(limit || 10, tenantId);
    }
    getVoucherStats(tenantId) {
        return this.analyticsService.getVoucherStats(tenantId);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('points-trend'),
    (0, swagger_1.ApiOperation)({ summary: 'Points earned/burned over time (daily)' }),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getPointsTrend", null);
__decorate([
    (0, common_1.Get)('member-growth'),
    (0, swagger_1.ApiOperation)({ summary: 'New member registrations over time (daily)' }),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getMemberGrowth", null);
__decorate([
    (0, common_1.Get)('campaign-performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Campaign performance metrics' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getCampaignPerformance", null);
__decorate([
    (0, common_1.Get)('top-members'),
    (0, swagger_1.ApiOperation)({ summary: 'Top members by points' }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getTopMembers", null);
__decorate([
    (0, common_1.Get)('voucher-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Voucher usage statistics' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getVoucherStats", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [typeof (_a = typeof analytics_service_1.AnalyticsService !== "undefined" && analytics_service_1.AnalyticsService) === "function" ? _a : Object])
], AnalyticsController);


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPointsTrend(days, tenantId) {
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const transactions = await this.prisma.pointTransaction.findMany({
            where: {
                createdAt: { gte: since },
                ...(tenantId ? { member: { tenantId } } : {}),
            },
            orderBy: { createdAt: 'asc' },
            include: { member: { select: { tenantId: true } } },
        });
        const daily = {};
        for (const t of transactions) {
            const day = t.createdAt.toISOString().slice(0, 10);
            if (!daily[day])
                daily[day] = { earned: 0, burned: 0 };
            if (t.amount > 0)
                daily[day].earned += t.amount;
            else
                daily[day].burned += Math.abs(t.amount);
        }
        return Object.entries(daily).map(([date, val]) => ({ date, ...val }));
    }
    async getMemberGrowth(days, tenantId) {
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const where = { createdAt: { gte: since }, ...(tenantId ? { tenantId } : {}) };
        const members = await this.prisma.member.findMany({ where, orderBy: { createdAt: 'asc' } });
        const daily = {};
        for (const m of members) {
            const day = m.createdAt.toISOString().slice(0, 10);
            daily[day] = (daily[day] || 0) + 1;
        }
        let cumulative = 0;
        return Object.entries(daily).map(([date, count]) => {
            cumulative += count;
            return { date, newMembers: count, totalMembers: cumulative };
        });
    }
    async getCampaignPerformance(tenantId) {
        const where = tenantId ? { tenantId } : {};
        const campaigns = await this.prisma.campaign.findMany({ where });
        const total = campaigns.length;
        const active = campaigns.filter(c => c.status === 'ACTIVE').length;
        const completed = campaigns.filter(c => c.status === 'ENDED').length;
        return { total, active, completed, draft: total - active - completed };
    }
    async getTopMembers(limit, tenantId) {
        const where = tenantId ? { tenantId } : {};
        return this.prisma.member.findMany({
            where,
            orderBy: { totalPoints: 'desc' },
            take: limit,
            include: { tier: { select: { name: true, color: true } } },
        });
    }
    async getVoucherStats(tenantId) {
        const where = tenantId ? { tenantId } : {};
        const total = await this.prisma.voucher.count({ where });
        const used = await this.prisma.voucher.count({ where: { ...where, usedCount: { gt: 0 } } });
        return { total, used, remaining: total - used, usageRate: total > 0 ? ((used / total) * 100).toFixed(1) : '0' };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AnalyticsService);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationModule = void 0;
const common_1 = __webpack_require__(2);
const notification_controller_1 = __webpack_require__(76);
const notification_service_1 = __webpack_require__(77);
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        controllers: [notification_controller_1.NotificationController],
        providers: [notification_service_1.NotificationService],
        exports: [notification_service_1.NotificationService],
    })
], NotificationModule);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const notification_service_1 = __webpack_require__(77);
const jwt_auth_guard_1 = __webpack_require__(27);
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    createTemplate(body) {
        return this.notificationService.createTemplate(body);
    }
    listTemplates(tenantId, page, limit, search) {
        return this.notificationService.listTemplates(tenantId, page, limit, search);
    }
    updateTemplate(id, body) {
        return this.notificationService.updateTemplate(id, body);
    }
    deleteTemplate(id) {
        return this.notificationService.deleteTemplate(id);
    }
    send(body) {
        return this.notificationService.send(body);
    }
    listLogs(tenantId, page, limit, search) {
        return this.notificationService.listLogs(tenantId, page, limit, search);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Post)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a notification template' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'List notification templates' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "listTemplates", null);
__decorate([
    (0, common_1.Put)('templates/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update notification template' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete notification template' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "deleteTemplate", null);
__decorate([
    (0, common_1.Post)('send'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a notification (email/SMS)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "send", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiOperation)({ summary: 'List notification logs' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "listLogs", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [typeof (_a = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _a : Object])
], NotificationController);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let NotificationService = class NotificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTemplate(data) {
        return data;
    }
    async listTemplates(tenantId, page = 1, limit = 20, search) {
        return { data: [], total: 0, page, limit, totalPages: 0 };
    }
    async updateTemplate(id, data) {
        return { id, ...data };
    }
    async deleteTemplate(id) {
        return { deleted: true };
    }
    async send(data) {
        const log = await this.prisma.notificationLog.create({
            data: {
                templateId: data.templateId,
                recipient: data.recipient,
                channel: data.channel,
                subject: 'Notification',
                content: JSON.stringify(data.variables || {}),
                status: 'SENT',
                sentAt: new Date(),
            },
        });
        return { logId: log.id, channel: data.channel, recipient: data.recipient, status: 'SENT' };
    }
    async listLogs(tenantId, page = 1, limit = 20, search) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { recipient: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.notificationLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.notificationLog.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], NotificationService);


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditLogModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_module_1 = __webpack_require__(9);
const audit_log_service_1 = __webpack_require__(79);
const audit_log_controller_1 = __webpack_require__(80);
let AuditLogModule = class AuditLogModule {
};
exports.AuditLogModule = AuditLogModule;
exports.AuditLogModule = AuditLogModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [audit_log_controller_1.AuditLogController],
        providers: [audit_log_service_1.AuditLogService],
        exports: [audit_log_service_1.AuditLogService],
    })
], AuditLogModule);


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditLogService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
let AuditLogService = class AuditLogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(params) {
        return this.prisma.auditLog.create({ data: params });
    }
    async findAll(page = 1, limit = 20, search) {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { entityType: { contains: search, mode: 'insensitive' } },
                { userEmail: { contains: search, mode: 'insensitive' } },
            ]
        } : {};
        const [data, total] = await Promise.all([
            this.prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.auditLog.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AuditLogService);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditLogController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const audit_log_service_1 = __webpack_require__(79);
const jwt_auth_guard_1 = __webpack_require__(27);
let AuditLogController = class AuditLogController {
    auditLogService;
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    findAll(page, limit, search) {
        return this.auditLogService.findAll(page, limit, search);
    }
};
exports.AuditLogController = AuditLogController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List audit logs (paginated)' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], AuditLogController.prototype, "findAll", null);
exports.AuditLogController = AuditLogController = __decorate([
    (0, swagger_1.ApiTags)('Audit Logs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('audit-logs'),
    __metadata("design:paramtypes", [typeof (_a = typeof audit_log_service_1.AuditLogService !== "undefined" && audit_log_service_1.AuditLogService) === "function" ? _a : Object])
], AuditLogController);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalExceptionFilter = void 0;
const common_1 = __webpack_require__(2);
let GlobalExceptionFilter = class GlobalExceptionFilter {
    logger = new common_1.Logger('ExceptionFilter');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : res.message || exception.message;
        }
        else if (exception instanceof Error) {
            message = exception.message;
            this.logger.error(`Unhandled: ${exception.message}`, exception.stack);
        }
        response.status(status).json({
            success: false,
            statusCode: status,
            message: Array.isArray(message) ? message : [message],
            timestamp: new Date().toISOString(),
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(2);
const rxjs_1 = __webpack_require__(83);
let LoggingInterceptor = class LoggingInterceptor {
    logger = new common_1.Logger('HTTP');
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const now = Date.now();
        return next.handle().pipe((0, rxjs_1.tap)(() => this.logger.log(`${method} ${url} ${Date.now() - now}ms`)));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);


/***/ }),
/* 83 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const api_gateway_module_1 = __webpack_require__(4);
const global_exception_filter_1 = __webpack_require__(81);
const logging_interceptor_1 = __webpack_require__(82);
async function bootstrap() {
    const logger = new common_1.Logger('ApiGateway');
    const app = await core_1.NestFactory.create(api_gateway_module_1.ApiGatewayModule);
    app.setGlobalPrefix('api/v1');
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Loyalty Platform - API Gateway')
        .setDescription('API Gateway for Loyalty Platform Microservices')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.API_GATEWAY_PORT ?? 3001;
    await app.listen(port);
    logger.log(`API Gateway running on port ${port}`);
}
bootstrap();

})();

/******/ })()
;