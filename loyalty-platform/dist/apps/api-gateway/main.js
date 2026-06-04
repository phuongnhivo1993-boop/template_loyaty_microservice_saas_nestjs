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
const core_1 = __webpack_require__(1);
const throttler_1 = __webpack_require__(5);
const platform_express_1 = __webpack_require__(6);
const schedule_1 = __webpack_require__(7);
const roles_guard_1 = __webpack_require__(8);
const tenant_guard_1 = __webpack_require__(10);
const api_gateway_controller_1 = __webpack_require__(13);
const api_gateway_service_1 = __webpack_require__(14);
const prisma_module_1 = __webpack_require__(15);
const auth_module_1 = __webpack_require__(18);
const tenant_module_1 = __webpack_require__(28);
const user_module_1 = __webpack_require__(33);
const member_module_1 = __webpack_require__(37);
const member_self_module_1 = __webpack_require__(57);
const member_voucher_module_1 = __webpack_require__(60);
const tier_module_1 = __webpack_require__(42);
const point_module_1 = __webpack_require__(49);
const campaign_module_1 = __webpack_require__(64);
const reward_module_1 = __webpack_require__(68);
const voucher_module_1 = __webpack_require__(72);
const promotion_module_1 = __webpack_require__(77);
const referral_module_1 = __webpack_require__(81);
const gamification_module_1 = __webpack_require__(84);
const dashboard_module_1 = __webpack_require__(88);
const upload_module_1 = __webpack_require__(91);
const analytics_module_1 = __webpack_require__(96);
const notification_module_1 = __webpack_require__(99);
const audit_log_module_1 = __webpack_require__(102);
const export_module_1 = __webpack_require__(105);
const import_module_1 = __webpack_require__(108);
const bulk_module_1 = __webpack_require__(112);
const settings_module_1 = __webpack_require__(55);
const checkin_module_1 = __webpack_require__(115);
const earning_rule_module_1 = __webpack_require__(118);
const store_module_1 = __webpack_require__(122);
const cashback_module_1 = __webpack_require__(125);
const partnership_module_1 = __webpack_require__(128);
const webhook_module_1 = __webpack_require__(131);
const gift_card_module_1 = __webpack_require__(134);
const feedback_module_1 = __webpack_require__(137);
const product_module_1 = __webpack_require__(140);
const product_category_module_1 = __webpack_require__(144);
const order_module_1 = __webpack_require__(148);
const member_segmentation_module_1 = __webpack_require__(162);
const coupon_module_1 = __webpack_require__(157);
const websocket_module_1 = __webpack_require__(160);
let ApiGatewayModule = class ApiGatewayModule {
};
exports.ApiGatewayModule = ApiGatewayModule;
exports.ApiGatewayModule = ApiGatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
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
            export_module_1.ExportModule,
            import_module_1.ImportModule,
            bulk_module_1.BulkModule,
            settings_module_1.SettingsModule,
            checkin_module_1.CheckinModule,
            earning_rule_module_1.EarningRuleModule,
            store_module_1.StoreModule,
            cashback_module_1.CashbackModule,
            partnership_module_1.PartnershipModule,
            webhook_module_1.WebhookModule,
            gift_card_module_1.GiftCardModule,
            feedback_module_1.FeedbackModule,
            product_module_1.ProductModule,
            product_category_module_1.ProductCategoryModule,
            order_module_1.OrderModule,
            member_segmentation_module_1.MemberSegmentationModule,
            coupon_module_1.CouponModule,
            websocket_module_1.WebSocketModule,
        ],
        controllers: [api_gateway_controller_1.ApiGatewayController],
        providers: [
            api_gateway_service_1.ApiGatewayService,
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
            { provide: core_1.APP_GUARD, useClass: tenant_guard_1.TenantGuard },
        ],
    })
], ApiGatewayModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 8 */
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
const roles_decorator_1 = __webpack_require__(9);
let RolesGuard = class RolesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0)
            return true;
        const { user } = context.switchToHttp().getRequest();
        if (!user)
            return true;
        return requiredRoles.includes(user.role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(2);
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 10 */
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
var TenantGuard_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TenantGuard = void 0;
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(11);
const skip_tenant_decorator_1 = __webpack_require__(12);
let TenantGuard = TenantGuard_1 = class TenantGuard {
    reflector;
    jwtService;
    logger = new common_1.Logger(TenantGuard_1.name);
    constructor(reflector, jwtService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const skip = this.reflector.getAllAndOverride(skip_tenant_decorator_1.TENANT_SKIP_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (skip) {
            this.logger.debug('TenantCheck skipped via @SkipTenantCheck()');
            return true;
        }
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        let userTenantId;
        if (user && user.tenantId) {
            userTenantId = user.tenantId;
        }
        else {
            const authHeader = req.headers?.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                try {
                    const token = authHeader.slice(7);
                    const payload = this.jwtService.decode(token);
                    userTenantId = payload?.tenantId;
                }
                catch {
                    this.logger.warn('Failed to decode JWT in TenantGuard');
                }
            }
        }
        this.logger.debug(`TenantGuard: userTenantId=${userTenantId}`);
        if (!userTenantId) {
            this.logger.debug('No tenantId in token or user, allowing');
            return true;
        }
        const reqTenantId = req.query?.tenantId || req.body?.tenantId || req.params?.tenantId;
        const userRole = user?.role || '';
        if (userRole === 'HOST') {
            req.tenantId = reqTenantId || userTenantId;
            this.logger.debug(`HOST access: req.tenantId=${req.tenantId}`);
            return true;
        }
        if (reqTenantId && reqTenantId !== userTenantId) {
            this.logger.warn(`Cross-tenant access denied: user=${userTenantId}, requested=${reqTenantId}`);
            throw new common_1.ForbiddenException('Cross-tenant access denied');
        }
        req.tenantId = userTenantId;
        this.logger.debug(`Auto-scoped to tenant: ${req.tenantId}`);
        return true;
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = TenantGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], TenantGuard);


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkipTenantCheck = exports.TENANT_SKIP_KEY = void 0;
const common_1 = __webpack_require__(2);
exports.TENANT_SKIP_KEY = 'skipTenantCheck';
const SkipTenantCheck = () => (0, common_1.SetMetadata)(exports.TENANT_SKIP_KEY, true);
exports.SkipTenantCheck = SkipTenantCheck;


/***/ }),
/* 13 */
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
const api_gateway_service_1 = __webpack_require__(14);
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
/* 14 */
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
/* 15 */
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
const prisma_service_1 = __webpack_require__(16);
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
/* 16 */
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
const client_1 = __webpack_require__(17);
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
/* 17 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 18 */
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
const jwt_1 = __webpack_require__(11);
const passport_1 = __webpack_require__(19);
const auth_service_1 = __webpack_require__(20);
const auth_controller_1 = __webpack_require__(22);
const jwt_strategy_1 = __webpack_require__(26);
const roles_guard_1 = __webpack_require__(8);
const tenant_guard_1 = __webpack_require__(10);
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
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard],
    })
], AuthModule);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 20 */
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
const jwt_1 = __webpack_require__(11);
const bcrypt = __importStar(__webpack_require__(21));
const prisma_service_1 = __webpack_require__(16);
let AuthService = class AuthService {
    prisma;
    jwtService;
    saltRounds = 12;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async hashPassword(password) {
        return bcrypt.hash(password, this.saltRounds);
    }
    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    async registerHost(email, password, name) {
        const existing = await this.prisma.host.findUnique({ where: { email } });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const host = await this.prisma.host.create({
            data: { email, password: await this.hashPassword(password), name },
        });
        return { id: host.id, email: host.email, name: host.name };
    }
    async loginHost(email, password) {
        const host = await this.prisma.host.findUnique({ where: { email } });
        if (!host || !(await this.comparePassword(password, host.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateToken(host.id, host.email, 'HOST');
    }
    async loginTenant(email, password, tenantId) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await this.comparePassword(password, user.password))) {
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
        if (member.password &&
            !(await this.comparePassword(password, member.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateToken(member.id, member.email, 'MEMBER', member.tenantId);
    }
    async validateUser(email, password, role) {
        if (role === 'HOST') {
            const host = await this.prisma.host.findUnique({ where: { email } });
            if (host && (await this.comparePassword(password, host.password))) {
                return { id: host.id, email: host.email, role: 'HOST' };
            }
        }
        else if (role === 'TENANT') {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (user && (await this.comparePassword(password, user.password))) {
                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    tenantId: user.tenantId,
                };
            }
        }
        else if (role === 'MEMBER') {
            const member = await this.prisma.member.findUnique({ where: { email } });
            if (member &&
                member.password &&
                (await this.comparePassword(password, member.password))) {
                return {
                    id: member.id,
                    email: member.email,
                    role: 'MEMBER',
                    tenantId: member.tenantId,
                };
            }
        }
        return null;
    }
    generateToken(sub, email, role, tenantId) {
        const payload = { sub, email, role, tenantId };
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign({ sub, type: 'refresh' }, { expiresIn: '7d' }),
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            if (payload.type !== 'refresh')
                throw new common_1.UnauthorizedException('Invalid refresh token');
            return this.generateToken(payload.sub, payload.email || payload.sub, payload.role || 'MEMBER', payload.tenantId);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async forgotPassword(email) {
        const member = await this.prisma.member.findUnique({ where: { email } });
        const user = await this.prisma.user.findUnique({ where: { email } });
        const host = await this.prisma.host.findUnique({ where: { email } });
        if (!member && !user && !host) {
            return { message: 'If the email exists, a reset link has been sent' };
        }
        const resetToken = this.jwtService.sign({ email, type: 'reset' }, { expiresIn: '15m' });
        return { message: 'If the email exists, a reset link has been sent', resetToken };
    }
    async resetPassword(token, newPassword) {
        try {
            const payload = this.jwtService.verify(token);
            if (payload.type !== 'reset')
                throw new common_1.BadRequestException('Invalid reset token');
            const email = payload.email;
            const hashed = await this.hashPassword(newPassword);
            const member = await this.prisma.member.findUnique({ where: { email } });
            if (member && member.password) {
                await this.prisma.member.update({
                    where: { email },
                    data: { password: hashed },
                });
                return { message: 'Password reset successfully' };
            }
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (user && user.password) {
                await this.prisma.user.update({
                    where: { email },
                    data: { password: hashed },
                });
                return { message: 'Password reset successfully' };
            }
            throw new common_1.NotFoundException('User not found');
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException || err instanceof common_1.BadRequestException)
                throw err;
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
    }
    async changePassword(user, oldPassword, newPassword) {
        const { sub, role } = user;
        if (role === 'HOST') {
            const host = await this.prisma.host.findUnique({ where: { id: sub } });
            if (!host)
                throw new common_1.NotFoundException('User not found');
            if (!(await this.comparePassword(oldPassword, host.password))) {
                throw new common_1.UnauthorizedException('Current password is incorrect');
            }
            await this.prisma.host.update({
                where: { id: sub },
                data: { password: await this.hashPassword(newPassword) },
            });
        }
        else if (role === 'MEMBER') {
            const member = await this.prisma.member.findUnique({
                where: { id: sub },
            });
            if (!member)
                throw new common_1.NotFoundException('Member not found');
            if (!member.password)
                throw new common_1.BadRequestException('No password set. Use set-password first.');
            if (!(await this.comparePassword(oldPassword, member.password))) {
                throw new common_1.UnauthorizedException('Current password is incorrect');
            }
            await this.prisma.member.update({
                where: { id: sub },
                data: { password: await this.hashPassword(newPassword) },
            });
        }
        else {
            const userEntity = await this.prisma.user.findUnique({
                where: { id: sub },
            });
            if (!userEntity)
                throw new common_1.NotFoundException('User not found');
            if (!(await this.comparePassword(oldPassword, userEntity.password))) {
                throw new common_1.UnauthorizedException('Current password is incorrect');
            }
            await this.prisma.user.update({
                where: { id: sub },
                data: { password: await this.hashPassword(newPassword) },
            });
        }
        return { message: 'Password changed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("bcryptjs");

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(20);
const jwt_auth_guard_1 = __webpack_require__(23);
const skip_tenant_decorator_1 = __webpack_require__(12);
const common_dto_1 = __webpack_require__(24);
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
    refresh(body) {
        return this.authService.refreshToken(body.refreshToken);
    }
    async changePassword(req, body) {
        return this.authService.changePassword(req.user, body.oldPassword, body.newPassword);
    }
    forgotPassword(body) {
        return this.authService.forgotPassword(body.email);
    }
    resetPassword(body) {
        return this.authService.resetPassword(body.token, body.newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('host/register'),
    (0, skip_tenant_decorator_1.SkipTenantCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new host (super admin)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof common_dto_1.RegisterHostDto !== "undefined" && common_dto_1.RegisterHostDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerHost", null);
__decorate([
    (0, common_1.Post)('host/login'),
    (0, skip_tenant_decorator_1.SkipTenantCheck)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login as host' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof common_dto_1.LoginDto !== "undefined" && common_dto_1.LoginDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginHost", null);
__decorate([
    (0, common_1.Post)('tenant/login'),
    (0, skip_tenant_decorator_1.SkipTenantCheck)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login as tenant admin/user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginTenant", null);
__decorate([
    (0, common_1.Post)('member/login'),
    (0, skip_tenant_decorator_1.SkipTenantCheck)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login as member' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof common_dto_1.LoginDto !== "undefined" && common_dto_1.LoginDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginMember", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change password for authenticated user' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, skip_tenant_decorator_1.SkipTenantCheck)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset (sends email with reset token)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, skip_tenant_decorator_1.SkipTenantCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password using reset token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 23 */
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
const passport_1 = __webpack_require__(19);
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
/* 24 */
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConvertReferralDto = exports.CreateReferralLinkDto = exports.BroadcastNotificationDto = exports.SendNotificationDto = exports.CreateNotificationTemplateDto = exports.AdjustPointsDto = exports.EarnPointsDto = exports.PaginationDto = exports.ValidateVoucherDto = exports.CreateVoucherDto = exports.RedeemRewardDto = exports.CreateRewardDto = exports.CreateCampaignDto = exports.CreateMemberDto = exports.CreateTenantDto = exports.RegisterHostDto = exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(25);
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
class AdjustPointsDto {
    memberId;
    amount;
    reason;
}
exports.AdjustPointsDto = AdjustPointsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdjustPointsDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdjustPointsDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdjustPointsDto.prototype, "reason", void 0);
class CreateNotificationTemplateDto {
    name;
    type;
    subject;
    content;
    variables;
    tenantId;
}
exports.CreateNotificationTemplateDto = CreateNotificationTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationTemplateDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationTemplateDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationTemplateDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationTemplateDto.prototype, "variables", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationTemplateDto.prototype, "tenantId", void 0);
class SendNotificationDto {
    templateId;
    recipient;
    channel;
    variables;
}
exports.SendNotificationDto = SendNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "recipient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], SendNotificationDto.prototype, "variables", void 0);
class BroadcastNotificationDto {
    templateId;
    channel;
    variables;
    tenantId;
}
exports.BroadcastNotificationDto = BroadcastNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BroadcastNotificationDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BroadcastNotificationDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], BroadcastNotificationDto.prototype, "variables", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BroadcastNotificationDto.prototype, "tenantId", void 0);
class CreateReferralLinkDto {
    referrerId;
    tenantId;
}
exports.CreateReferralLinkDto = CreateReferralLinkDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReferralLinkDto.prototype, "referrerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReferralLinkDto.prototype, "tenantId", void 0);
class ConvertReferralDto {
    refereeId;
}
exports.ConvertReferralDto = ConvertReferralDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConvertReferralDto.prototype, "refereeId", void 0);


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("class-validator");

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(19);
const passport_jwt_1 = __webpack_require__(27);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'loyalty_jwt_secret_key_change_in_production',
        });
    }
    async validate(payload) {
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            tenantId: payload.tenantId,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtStrategy);


/***/ }),
/* 27 */
/***/ ((module) => {

module.exports = require("passport-jwt");

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
exports.TenantModule = void 0;
const common_1 = __webpack_require__(2);
const tenant_service_1 = __webpack_require__(29);
const tenant_controller_1 = __webpack_require__(31);
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
/* 29 */
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
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
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
    async findAll(page = 1, limit = 20, search, status, sort) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { domain: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status)
            where.status = status;
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const [data, total] = await Promise.all([
            this.prisma.tenant.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
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
/* 30 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseSort = parseSort;
function parseSort(sort) {
    if (!sort)
        return { orderBy: 'createdAt', orderDirection: 'desc' };
    const [field, dir] = sort.split(':');
    return {
        orderBy: field || 'createdAt',
        orderDirection: (dir === 'asc' ? 'asc' : 'desc'),
    };
}


/***/ }),
/* 31 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TenantController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const tenant_service_1 = __webpack_require__(29);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const create_tenant_dto_1 = __webpack_require__(32);
let TenantController = class TenantController {
    tenantService;
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    create(body) {
        return this.tenantService.create(body);
    }
    findAll(query) {
        return this.tenantService.findAll(query.page, query.limit, query.search, query.status, query.sort);
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tenant' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_tenant_dto_1.CreateTenantDto !== "undefined" && create_tenant_dto_1.CreateTenantDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'List all tenants (with pagination & filtering)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_tenant_dto_1.TenantQueryDto !== "undefined" && create_tenant_dto_1.TenantQueryDto) === "function" ? _c : Object]),
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
    __metadata("design:paramtypes", [String, typeof (_d = typeof create_tenant_dto_1.UpdateTenantDto !== "undefined" && create_tenant_dto_1.UpdateTenantDto) === "function" ? _d : Object]),
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TenantQueryDto = exports.UpdateTenantDto = exports.CreateTenantDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
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
class UpdateTenantDto {
    name;
    email;
    phone;
    address;
    status;
}
exports.UpdateTenantDto = UpdateTenantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "status", void 0);
class TenantQueryDto {
    page;
    limit;
    search;
    status;
    sort;
}
exports.TenantQueryDto = TenantQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TenantQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TenantQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenantQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenantQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenantQueryDto.prototype, "sort", void 0);


/***/ }),
/* 33 */
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
const user_service_1 = __webpack_require__(34);
const user_controller_1 = __webpack_require__(35);
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
/* 34 */
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
const bcrypt = __importStar(__webpack_require__(21));
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async hashPassword(password) {
        return bcrypt.hash(password, 12);
    }
    async create(data) {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            throw new common_1.ConflictException('Email already exists');
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: await this.hashPassword(data.password),
                fullName: data.fullName,
                phone: data.phone,
                role: data.role || 'MEMBER',
                tenantId: data.tenantId,
            },
        });
    }
    async findAll(tenantId, page = 1, limit = 20, search, sort) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const user_service_1 = __webpack_require__(34);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const create_user_dto_1 = __webpack_require__(36);
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    create(body) {
        return this.userService.create(body);
    }
    findAll(query) {
        return this.userService.findAll(query.tenantId, query.page, query.limit, query.search, query.sort);
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all users (with pagination & sort)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_user_dto_1.UserQueryDto !== "undefined" && create_user_dto_1.UserQueryDto) === "function" ? _c : Object]),
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof create_user_dto_1.UpdateUserDto !== "undefined" && create_user_dto_1.UpdateUserDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserQueryDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
class CreateUserDto {
    email;
    password;
    fullName;
    phone;
    role;
    tenantId;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "tenantId", void 0);
class UpdateUserDto {
    fullName;
    phone;
    role;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
class UserQueryDto {
    tenantId;
    page;
    limit;
    search;
    sort;
}
exports.UserQueryDto = UserQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UserQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UserQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserQueryDto.prototype, "sort", void 0);


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
exports.MemberModule = void 0;
const common_1 = __webpack_require__(2);
const member_service_1 = __webpack_require__(38);
const member_controller_1 = __webpack_require__(40);
const tier_module_1 = __webpack_require__(42);
const point_module_1 = __webpack_require__(49);
const common_module_1 = __webpack_require__(46);
let MemberModule = class MemberModule {
};
exports.MemberModule = MemberModule;
exports.MemberModule = MemberModule = __decorate([
    (0, common_1.Module)({
        imports: [tier_module_1.TierModule, point_module_1.PointModule, common_module_1.CommonModule],
        controllers: [member_controller_1.MemberController],
        providers: [member_service_1.MemberService],
        exports: [member_service_1.MemberService],
    })
], MemberModule);


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const notification_trigger_service_1 = __webpack_require__(39);
const sort_util_1 = __webpack_require__(30);
let MemberService = class MemberService {
    prisma;
    notificationTrigger;
    constructor(prisma, notificationTrigger) {
        this.prisma = prisma;
        this.notificationTrigger = notificationTrigger;
    }
    async findTenantByDomain(domain) {
        return this.prisma.tenant.findFirst({ where: { domain } });
    }
    async create(data) {
        const existing = await this.prisma.member.findUnique({ where: { email: data.email } });
        if (existing)
            throw new common_1.ConflictException('Email already exists');
        const { birthday, tags, ...rest } = data;
        const member = await this.prisma.member.create({
            data: {
                ...rest,
                ...(birthday ? { birthday: new Date(birthday) } : {}),
                ...(tags ? { tags: { set: tags } } : {}),
            },
        });
        this.notificationTrigger.sendWelcome(member);
        return member;
    }
    async findAll(tenantId, page = 1, limit = 20, search, tierId, status, sort, tags) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (tierId)
            where.tierId = tierId;
        if (status)
            where.status = status;
        if (tags && tags.length > 0)
            where.tags = { hasSome: tags };
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.member.findMany({
                where,
                include: { tier: true },
                orderBy: { [orderBy]: orderDirection },
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
        const existing = await this.findOne(id);
        const { birthday, tags, ...rest } = data;
        const updated = await this.prisma.member.update({
            where: { id },
            data: {
                ...rest,
                ...(birthday !== undefined ? { birthday: birthday ? new Date(birthday) : null } : {}),
                ...(tags !== undefined ? { tags: { set: tags } } : {}),
            },
        });
        if (data.tierId && existing.tierId && data.tierId !== existing.tierId) {
            const oldTier = existing.tier ? this.prisma.tier.findUnique({ where: { id: existing.tierId } }) : null;
            const newTier = await this.prisma.tier.findUnique({ where: { id: data.tierId } });
            if (newTier) {
                const oldTierName = existing.tier?.name || 'Unknown';
                this.notificationTrigger.sendTierChanged(id, oldTierName, newTier.name);
            }
        }
        return updated;
    }
    async kycVerify(id) {
        await this.findOne(id);
        return this.prisma.member.update({
            where: { id },
            data: { kycVerified: true, status: 'ACTIVE' },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.member.delete({ where: { id } });
    }
    async toggleStatus(id) {
        const member = await this.findOne(id);
        const newStatus = member.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
        return this.prisma.member.update({ where: { id }, data: { status: newStatus } });
    }
    async getActivity(memberId) {
        await this.findOne(memberId);
        const [transactions, vouchers, referrals] = await Promise.all([
            this.prisma.pointTransaction.findMany({
                where: { memberId },
                orderBy: { createdAt: 'desc' },
                take: 50,
            }),
            this.prisma.memberVoucher.findMany({
                where: { memberId },
                include: { voucher: true },
                orderBy: { createdAt: 'desc' },
                take: 20,
            }),
            this.prisma.referral.findMany({
                where: { referrerId: memberId },
                include: { referee: { select: { id: true, fullName: true, email: true } } },
                orderBy: { createdAt: 'desc' },
                take: 20,
            }),
        ]);
        return { transactions, vouchers, referrals };
    }
    async getTierSuggestion(id) {
        const member = await this.prisma.member.findUnique({
            where: { id },
            include: { tier: true, tenant: { include: { tiers: { orderBy: { minPoints: 'asc' } } } } },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const tiers = member.tenant.tiers;
        const currentTierIndex = tiers.findIndex(t => t.id === member.tierId);
        const nextTier = tiers[currentTierIndex + 1];
        if (!nextTier)
            return { suggestion: null, message: 'Already at highest tier' };
        const pointsNeeded = nextTier.minPoints - member.totalPoints;
        return {
            currentTier: member.tier?.name || 'N/A',
            nextTier: nextTier.name,
            pointsNeeded: Math.max(0, pointsNeeded),
            pointsMultiplier: nextTier.pointsMultiplier,
            message: pointsNeeded <= 0
                ? `${member.fullName} đủ điều kiện lên hạng ${nextTier.name}!`
                : `${member.fullName} cần ${pointsNeeded.toLocaleString()} điểm nữa để lên ${nextTier.name} (x${nextTier.pointsMultiplier} điểm)`,
        };
    }
    async adjustPoints(id, amount, reason) {
        const member = await this.findOne(id);
        if (amount < 0 && member.availablePoints < Math.abs(amount)) {
            throw new common_1.BadRequestException(`Insufficient points. Available: ${member.availablePoints}, requested: ${Math.abs(amount)}`);
        }
        const [transaction] = await this.prisma.$transaction([
            this.prisma.pointTransaction.create({
                data: {
                    memberId: id,
                    type: amount >= 0 ? 'EARN' : 'BURN',
                    amount,
                    balance: member.availablePoints + amount,
                    reason: `Admin adjustment: ${reason}`,
                },
            }),
            this.prisma.member.update({
                where: { id },
                data: {
                    totalPoints: { increment: amount },
                    availablePoints: { increment: amount },
                },
            }),
        ]);
        return { transaction, newBalance: member.availablePoints + amount };
    }
};
exports.MemberService = MemberService;
exports.MemberService = MemberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_trigger_service_1.NotificationTriggerService !== "undefined" && notification_trigger_service_1.NotificationTriggerService) === "function" ? _b : Object])
], MemberService);


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
var NotificationTriggerService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationTriggerService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
let NotificationTriggerService = NotificationTriggerService_1 = class NotificationTriggerService {
    prisma;
    logger = new common_1.Logger(NotificationTriggerService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendWelcome(member) {
        try {
            const template = await this.prisma.notificationTemplate.findFirst({
                where: { tenantId: member.tenantId, name: { contains: 'welcome', mode: 'insensitive' } },
            });
            if (!template) {
                this.logger.log(`No welcome template found for tenant ${member.tenantId}`);
                return;
            }
            const content = template.content
                .replace(/{{fullName}}/g, member.fullName)
                .replace(/{{email}}/g, member.email);
            await this.prisma.notificationLog.create({
                data: {
                    templateId: template.id,
                    recipient: member.email,
                    channel: 'email',
                    subject: template.subject.replace(/{{fullName}}/g, member.fullName),
                    content,
                    status: 'SENT',
                    sentAt: new Date(),
                    tenantId: member.tenantId,
                },
            });
            this.logger.log(`Welcome notification sent to ${member.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send welcome notification to ${member.email}`, error);
        }
    }
    async sendPointsEarned(memberId, amount, reason) {
        try {
            const member = await this.prisma.member.findUnique({
                where: { id: memberId },
                select: { email: true, fullName: true, tenantId: true, availablePoints: true },
            });
            if (!member)
                return;
            const template = await this.prisma.notificationTemplate.findFirst({
                where: { tenantId: member.tenantId, name: { contains: 'points_earned', mode: 'insensitive' } },
            });
            if (!template) {
                this.logger.log(`No points_earned template found for tenant ${member.tenantId}`);
                return;
            }
            const content = template.content
                .replace(/{{fullName}}/g, member.fullName)
                .replace(/{{amount}}/g, amount.toLocaleString())
                .replace(/{{balance}}/g, member.availablePoints.toLocaleString())
                .replace(/{{reason}}/g, reason || '');
            await this.prisma.notificationLog.create({
                data: {
                    templateId: template.id,
                    recipient: member.email,
                    channel: 'email',
                    subject: template.subject.replace(/{{amount}}/g, amount.toLocaleString()),
                    content,
                    status: 'SENT',
                    sentAt: new Date(),
                    tenantId: member.tenantId,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to send points earned notification to member ${memberId}`, error);
        }
    }
    async sendTierChanged(memberId, oldTierName, newTierName) {
        try {
            const member = await this.prisma.member.findUnique({
                where: { id: memberId },
                select: { email: true, fullName: true, tenantId: true },
            });
            if (!member)
                return;
            const template = await this.prisma.notificationTemplate.findFirst({
                where: { tenantId: member.tenantId, name: { contains: 'tier_changed', mode: 'insensitive' } },
            });
            if (!template) {
                this.logger.log(`No tier_changed template found for tenant ${member.tenantId}`);
                return;
            }
            const content = template.content
                .replace(/{{fullName}}/g, member.fullName)
                .replace(/{{oldTier}}/g, oldTierName)
                .replace(/{{newTier}}/g, newTierName);
            await this.prisma.notificationLog.create({
                data: {
                    templateId: template.id,
                    recipient: member.email,
                    channel: 'email',
                    subject: template.subject.replace(/{{newTier}}/g, newTierName),
                    content,
                    status: 'SENT',
                    sentAt: new Date(),
                    tenantId: member.tenantId,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to send tier changed notification to member ${memberId}`, error);
        }
    }
};
exports.NotificationTriggerService = NotificationTriggerService;
exports.NotificationTriggerService = NotificationTriggerService = NotificationTriggerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], NotificationTriggerService);


/***/ }),
/* 40 */
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
exports.MemberController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const member_service_1 = __webpack_require__(38);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const skip_tenant_decorator_1 = __webpack_require__(12);
const create_member_dto_1 = __webpack_require__(41);
let MemberController = class MemberController {
    memberService;
    constructor(memberService) {
        this.memberService = memberService;
    }
    async register(body) {
        let { tenantId } = body;
        if (!tenantId && body.tenantDomain) {
            const tenant = await this.memberService.findTenantByDomain(body.tenantDomain);
            if (tenant)
                tenantId = tenant.id;
        }
        return this.memberService.create({ ...body, tenantId: tenantId || '' });
    }
    create(req, body) {
        return this.memberService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
    }
    findAll(req, query) {
        return this.memberService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.tierId, query.status, query.sort, query.tags);
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
    remove(id) {
        return this.memberService.remove(id);
    }
    toggleStatus(id) {
        return this.memberService.toggleStatus(id);
    }
    updateTags(id, body) {
        return this.memberService.update(id, { tags: body.tags });
    }
    tierSuggestion(id) {
        return this.memberService.getTierSuggestion(id);
    }
    getActivity(id) {
        return this.memberService.getActivity(id);
    }
    adjustPoints(id, body) {
        return this.memberService.adjustPoints(id, body.amount, body.reason);
    }
};
exports.MemberController = MemberController;
__decorate([
    (0, common_1.Post)('register'),
    (0, skip_tenant_decorator_1.SkipTenantCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Public member self-registration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_member_dto_1.RegisterMemberDto !== "undefined" && create_member_dto_1.RegisterMemberDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "register", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: register a new member' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof create_member_dto_1.CreateMemberDto !== "undefined" && create_member_dto_1.CreateMemberDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'List members (with pagination & filtering)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof create_member_dto_1.MemberQueryDto !== "undefined" && create_member_dto_1.MemberQueryDto) === "function" ? _d : Object]),
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Update member' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof create_member_dto_1.UpdateMemberDto !== "undefined" && create_member_dto_1.UpdateMemberDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/kyc'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify KYC for member' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "kycVerify", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete member' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/toggle-status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Lock/Unlock member' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "toggleStatus", null);
__decorate([
    (0, common_1.Post)(':id/tags'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Update member tags' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "updateTags", null);
__decorate([
    (0, common_1.Get)(':id/tier-suggestion'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get tier upgrade suggestion' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "tierSuggestion", null);
__decorate([
    (0, common_1.Get)(':id/activity'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get member activity timeline' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "getActivity", null);
__decorate([
    (0, common_1.Post)(':id/points'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Manual point adjustment (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "adjustPoints", null);
exports.MemberController = MemberController = __decorate([
    (0, swagger_1.ApiTags)('Members'),
    (0, common_1.Controller)('members'),
    __metadata("design:paramtypes", [typeof (_a = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _a : Object])
], MemberController);


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterMemberDto = exports.MemberQueryDto = exports.UpdateMemberDto = exports.CreateMemberDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
class CreateMemberDto {
    email;
    fullName;
    phone;
    birthday;
    tags;
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
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "birthday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateMemberDto.prototype, "tags", void 0);
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
class UpdateMemberDto {
    fullName;
    phone;
    birthday;
    tags;
    tierId;
    status;
}
exports.UpdateMemberDto = UpdateMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "birthday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateMemberDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "tierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "status", void 0);
class MemberQueryDto {
    tenantId;
    page;
    limit;
    search;
    tierId;
    status;
    tags;
    sort;
}
exports.MemberQueryDto = MemberQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MemberQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MemberQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MemberQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MemberQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MemberQueryDto.prototype, "tierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MemberQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MemberQueryDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MemberQueryDto.prototype, "sort", void 0);
class RegisterMemberDto {
    email;
    fullName;
    phone;
    tenantId;
    tenantDomain;
}
exports.RegisterMemberDto = RegisterMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterMemberDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterMemberDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterMemberDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterMemberDto.prototype, "tenantDomain", void 0);


/***/ }),
/* 42 */
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
const tier_service_1 = __webpack_require__(43);
const tier_controller_1 = __webpack_require__(44);
const common_module_1 = __webpack_require__(46);
let TierModule = class TierModule {
};
exports.TierModule = TierModule;
exports.TierModule = TierModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule],
        controllers: [tier_controller_1.TierController],
        providers: [tier_service_1.TierService],
        exports: [tier_service_1.TierService],
    })
], TierModule);


/***/ }),
/* 43 */
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
var TierService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TierService = void 0;
const common_1 = __webpack_require__(2);
const schedule_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(16);
const notification_trigger_service_1 = __webpack_require__(39);
const sort_util_1 = __webpack_require__(30);
let TierService = TierService_1 = class TierService {
    prisma;
    notificationTrigger;
    logger = new common_1.Logger(TierService_1.name);
    constructor(prisma, notificationTrigger) {
        this.prisma = prisma;
        this.notificationTrigger = notificationTrigger;
    }
    create(data) {
        return this.prisma.tier.create({
            data: {
                ...data,
                minPoints: data.minPoints ?? 0,
                maxPoints: data.maxPoints ?? 999999,
                pointsMultiplier: data.pointsMultiplier ?? 1.0,
            },
        });
    }
    async findAll(tenantId, page = 1, limit = 20, search, sort, status) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status) {
            where.status = status;
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.tier.findMany({ where, orderBy: sort ? { [orderBy]: orderDirection } : { minPoints: 'asc' }, skip, take: limit }),
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
    async assignTierToMember(memberId) {
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
            include: { tenant: { include: { tiers: { orderBy: { minPoints: 'desc' } } } }, tier: true },
        });
        if (!member || !member.tenant)
            return;
        const tiers = member.tenant.tiers;
        if (tiers.length === 0)
            return;
        const matchingTier = tiers.find(t => member.totalPoints >= t.minPoints && member.totalPoints <= t.maxPoints);
        if (matchingTier && member.tierId !== matchingTier.id) {
            const oldTierName = member.tier?.name || 'Unknown';
            await this.prisma.member.update({
                where: { id: memberId },
                data: { tierId: matchingTier.id },
            });
            this.logger.log(`Member ${memberId} upgraded/downgraded to tier ${matchingTier.name}`);
            this.notificationTrigger.sendTierChanged(memberId, oldTierName, matchingTier.name);
        }
    }
    async autoAssignTiers() {
        this.logger.log('Running auto tier assignment...');
        const tenants = await this.prisma.tenant.findMany({
            where: { status: 'ACTIVE' },
            include: { tiers: { orderBy: { minPoints: 'desc' } } },
        });
        let updated = 0;
        for (const tenant of tenants) {
            if (tenant.tiers.length === 0)
                continue;
            const members = await this.prisma.member.findMany({
                where: { tenantId: tenant.id, status: 'ACTIVE' },
            });
            for (const member of members) {
                const matchingTier = tenant.tiers.find(t => member.totalPoints >= t.minPoints && member.totalPoints <= t.maxPoints);
                if (matchingTier && member.tierId !== matchingTier.id) {
                    await this.prisma.member.update({
                        where: { id: member.id },
                        data: { tierId: matchingTier.id },
                    });
                    updated++;
                }
            }
        }
        this.logger.log(`Auto tier assignment complete. ${updated} members updated.`);
    }
};
exports.TierService = TierService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], TierService.prototype, "autoAssignTiers", null);
exports.TierService = TierService = TierService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_trigger_service_1.NotificationTriggerService !== "undefined" && notification_trigger_service_1.NotificationTriggerService) === "function" ? _b : Object])
], TierService);


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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TierController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const tier_service_1 = __webpack_require__(43);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const create_tier_dto_1 = __webpack_require__(45);
let TierController = class TierController {
    tierService;
    constructor(tierService) {
        this.tierService = tierService;
    }
    create(req, body) {
        return this.tierService.create({
            ...body,
            tenantId: req.tenantId ?? body.tenantId,
            minPoints: body.minPoints ?? 0,
            maxPoints: body.maxPoints ?? 999999,
        });
    }
    findAll(req, query) {
        return this.tierService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.sort);
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a tier' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_tier_dto_1.CreateTierDto !== "undefined" && create_tier_dto_1.CreateTierDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], TierController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List tiers (with pagination & sort)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof create_tier_dto_1.TierQueryDto !== "undefined" && create_tier_dto_1.TierQueryDto) === "function" ? _c : Object]),
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tier' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof create_tier_dto_1.UpdateTierDto !== "undefined" && create_tier_dto_1.UpdateTierDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], TierController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TierQueryDto = exports.UpdateTierDto = exports.CreateTierDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
class CreateTierDto {
    name;
    minPoints;
    maxPoints;
    pointsMultiplier;
    benefits;
    color;
    tenantId;
}
exports.CreateTierDto = CreateTierDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTierDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTierDto.prototype, "minPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 999999 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTierDto.prototype, "maxPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTierDto.prototype, "pointsMultiplier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTierDto.prototype, "benefits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTierDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTierDto.prototype, "tenantId", void 0);
class UpdateTierDto {
    name;
    minPoints;
    maxPoints;
    pointsMultiplier;
    benefits;
    color;
}
exports.UpdateTierDto = UpdateTierDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTierDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTierDto.prototype, "minPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTierDto.prototype, "maxPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTierDto.prototype, "pointsMultiplier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTierDto.prototype, "benefits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTierDto.prototype, "color", void 0);
class TierQueryDto {
    tenantId;
    page;
    limit;
    search;
    sort;
}
exports.TierQueryDto = TierQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TierQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TierQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TierQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TierQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TierQueryDto.prototype, "sort", void 0);


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
exports.CommonModule = void 0;
const common_1 = __webpack_require__(2);
const notification_trigger_service_1 = __webpack_require__(39);
const cache_service_1 = __webpack_require__(47);
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        providers: [notification_trigger_service_1.NotificationTriggerService, cache_service_1.CacheService],
        exports: [notification_trigger_service_1.NotificationTriggerService, cache_service_1.CacheService],
    })
], CommonModule);


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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CacheService = void 0;
const common_1 = __webpack_require__(2);
const ioredis_1 = __importDefault(__webpack_require__(48));
let CacheService = CacheService_1 = class CacheService {
    logger = new common_1.Logger(CacheService_1.name);
    client;
    defaultTtl = 300;
    constructor() {
        const url = process.env.REDIS_URL || 'redis://localhost:6379';
        this.client = new ioredis_1.default(url, {
            retryStrategy: (times) => {
                if (times > 3) {
                    this.logger.warn('Redis connection failed after 3 retries, cache disabled');
                    return null;
                }
                return Math.min(times * 200, 2000);
            },
            lazyConnect: true,
        });
        this.client.on('error', (err) => {
            this.logger.warn(`Redis error: ${err.message}`);
        });
        this.client.connect().catch((err) => {
            this.logger.warn(`Redis connection failed: ${err.message}. Cache will be disabled.`);
        });
    }
    async get(key) {
        try {
            const val = await this.client.get(key);
            if (val)
                return JSON.parse(val);
        }
        catch { }
        return null;
    }
    async set(key, value, ttlSeconds) {
        try {
            const ttl = ttlSeconds ?? this.defaultTtl;
            await this.client.set(key, JSON.stringify(value), 'EX', ttl);
        }
        catch { }
    }
    async del(key) {
        try {
            await this.client.del(key);
        }
        catch { }
    }
    async delPattern(pattern) {
        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(...keys);
            }
        }
        catch { }
    }
    onModuleDestroy() {
        this.client.quit().catch(() => { });
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CacheService);


/***/ }),
/* 48 */
/***/ ((module) => {

module.exports = require("ioredis");

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
exports.PointModule = void 0;
const common_1 = __webpack_require__(2);
const point_service_1 = __webpack_require__(50);
const point_controller_1 = __webpack_require__(51);
const point_expiry_service_1 = __webpack_require__(53);
const settings_module_1 = __webpack_require__(55);
const common_module_1 = __webpack_require__(46);
let PointModule = class PointModule {
};
exports.PointModule = PointModule;
exports.PointModule = PointModule = __decorate([
    (0, common_1.Module)({
        imports: [settings_module_1.SettingsModule, common_module_1.CommonModule],
        controllers: [point_controller_1.PointController],
        providers: [point_service_1.PointService, point_expiry_service_1.PointExpiryService],
        exports: [point_service_1.PointService],
    })
], PointModule);


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const notification_trigger_service_1 = __webpack_require__(39);
let PointService = class PointService {
    prisma;
    notificationTrigger;
    constructor(prisma, notificationTrigger) {
        this.prisma = prisma;
        this.notificationTrigger = notificationTrigger;
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
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
            include: { tier: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const multiplier = member.tier?.pointsMultiplier ?? 1.0;
        const finalAmount = Math.round(amount * multiplier);
        const newTotal = member.totalPoints + finalAmount;
        const [transaction] = await this.prisma.$transaction([
            this.prisma.pointTransaction.create({
                data: {
                    memberId,
                    type: 'EARN',
                    amount: finalAmount,
                    balance: member.availablePoints + finalAmount,
                    reason: reason ? `${reason} (x${multiplier})` : undefined,
                },
            }),
            this.prisma.member.update({
                where: { id: memberId },
                data: {
                    totalPoints: { increment: finalAmount },
                    availablePoints: { increment: finalAmount },
                },
            }),
        ]);
        const oldTierId = member.tierId;
        await this.maybeUpgradeTier(memberId, member.tenantId, newTotal);
        const updatedMember = await this.prisma.member.findUnique({ where: { id: memberId }, include: { tier: true } });
        if (updatedMember?.tierId && updatedMember.tierId !== oldTierId && updatedMember.tier) {
            const oldTierName = member.tier?.name || 'Unknown';
            this.notificationTrigger.sendTierChanged(memberId, oldTierName, updatedMember.tier.name);
        }
        this.notificationTrigger.sendPointsEarned(memberId, finalAmount, reason);
        return transaction;
    }
    async maybeUpgradeTier(memberId, tenantId, totalPoints) {
        const tiers = await this.prisma.tier.findMany({
            where: { tenantId, minPoints: { lte: totalPoints }, maxPoints: { gte: totalPoints } },
            orderBy: { minPoints: 'desc' },
            take: 1,
        });
        if (tiers.length > 0) {
            const member = await this.prisma.member.findUnique({ where: { id: memberId } });
            if (member && member.tierId !== tiers[0].id) {
                await this.prisma.member.update({
                    where: { id: memberId },
                    data: { tierId: tiers[0].id },
                });
            }
        }
    }
    async burn(memberId, amount, reason) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (member.availablePoints < amount) {
            throw new common_1.BadRequestException('Insufficient points');
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
    async getTransaction(id) {
        const transaction = await this.prisma.pointTransaction.findUnique({
            where: { id },
            include: { member: { select: { id: true, fullName: true, email: true } } },
        });
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        return transaction;
    }
    async getTransactions(memberId, page = 1, limit = 20, type, tenantId, search, sort) {
        const where = {};
        if (memberId)
            where.memberId = memberId;
        if (type)
            where.type = type;
        if (tenantId) {
            where.member = { tenantId };
        }
        if (search) {
            where.OR = [
                { reason: { contains: search, mode: 'insensitive' } },
                { reference: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const orderBy = sort ? { [sort.split(':')[0]]: (sort.split(':')[1] || 'desc') } : { createdAt: 'desc' };
        const [data, total] = await Promise.all([
            this.prisma.pointTransaction.findMany({
                where,
                orderBy: orderBy,
                skip,
                take: limit,
                include: { member: { select: { id: true, fullName: true, email: true, tenantId: true } } },
            }),
            this.prisma.pointTransaction.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async adjust(memberId, amount, reason) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const newAvailable = member.availablePoints + amount;
        if (newAvailable < 0)
            throw new common_1.BadRequestException('Insufficient points');
        const newTotal = member.totalPoints + (amount >= 0 ? amount : 0);
        const [transaction] = await this.prisma.$transaction([
            this.prisma.pointTransaction.create({
                data: {
                    memberId,
                    type: 'ADJUST',
                    amount,
                    balance: newAvailable,
                    reason,
                },
            }),
            this.prisma.member.update({
                where: { id: memberId },
                data: {
                    totalPoints: { increment: amount >= 0 ? amount : 0 },
                    availablePoints: { increment: amount },
                },
            }),
        ]);
        if (amount > 0)
            await this.maybeUpgradeTier(memberId, member.tenantId, newTotal);
        return transaction;
    }
};
exports.PointService = PointService;
exports.PointService = PointService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_trigger_service_1.NotificationTriggerService !== "undefined" && notification_trigger_service_1.NotificationTriggerService) === "function" ? _b : Object])
], PointService);


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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const point_service_1 = __webpack_require__(50);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const point_dto_1 = __webpack_require__(52);
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
    getTransaction(id) {
        return this.pointService.getTransaction(id);
    }
    getTransactions(req, query) {
        return this.pointService.getTransactions(query.memberId, query.page, query.limit, query.type, req.tenantId ?? query.tenantId, query.search, query.sort);
    }
    adjust(body) {
        return this.pointService.adjust(body.memberId, body.amount, body.reason);
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Earn points' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof point_dto_1.EarnPointsDto !== "undefined" && point_dto_1.EarnPointsDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PointController.prototype, "earn", null);
__decorate([
    (0, common_1.Post)('burn'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Burn points' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof point_dto_1.BurnPointsDto !== "undefined" && point_dto_1.BurnPointsDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], PointController.prototype, "burn", null);
__decorate([
    (0, common_1.Get)('transactions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get point transaction by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PointController.prototype, "getTransaction", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'List point transactions (paginated)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof point_dto_1.PointTransactionQueryDto !== "undefined" && point_dto_1.PointTransactionQueryDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], PointController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Post)('adjust'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: adjust member points' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof point_dto_1.AdjustPointsDto !== "undefined" && point_dto_1.AdjustPointsDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], PointController.prototype, "adjust", null);
exports.PointController = PointController = __decorate([
    (0, swagger_1.ApiTags)('Points'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('points'),
    __metadata("design:paramtypes", [typeof (_a = typeof point_service_1.PointService !== "undefined" && point_service_1.PointService) === "function" ? _a : Object])
], PointController);


/***/ }),
/* 52 */
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
exports.PointTransactionQueryDto = exports.AdjustPointsDto = exports.BurnPointsDto = exports.EarnPointsDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
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
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], EarnPointsDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EarnPointsDto.prototype, "reason", void 0);
class BurnPointsDto {
    memberId;
    amount;
    reason;
}
exports.BurnPointsDto = BurnPointsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BurnPointsDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], BurnPointsDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BurnPointsDto.prototype, "reason", void 0);
class AdjustPointsDto {
    memberId;
    amount;
    reason;
}
exports.AdjustPointsDto = AdjustPointsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdjustPointsDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AdjustPointsDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdjustPointsDto.prototype, "reason", void 0);
class PointTransactionQueryDto {
    memberId;
    tenantId;
    page;
    limit;
    type;
    search;
    sort;
}
exports.PointTransactionQueryDto = PointTransactionQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PointTransactionQueryDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PointTransactionQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PointTransactionQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PointTransactionQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PointTransactionQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PointTransactionQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PointTransactionQueryDto.prototype, "sort", void 0);


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
var PointExpiryService_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointExpiryService = void 0;
const common_1 = __webpack_require__(2);
const schedule_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(16);
const settings_service_1 = __webpack_require__(54);
let PointExpiryService = PointExpiryService_1 = class PointExpiryService {
    prisma;
    settingsService;
    logger = new common_1.Logger(PointExpiryService_1.name);
    constructor(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    async expireOldPoints() {
        this.logger.log('Running point expiry check...');
        const tenants = await this.prisma.tenant.findMany({ where: { status: 'ACTIVE' } });
        let totalExpired = 0;
        for (const tenant of tenants) {
            const settings = await this.settingsService.getTenantSettings(tenant.id);
            const config = settings.loyaltyConfig ?? {};
            if (config.autoExpirePoints === false) {
                this.logger.log(`Skipping expiry for tenant ${tenant.id} (autoExpirePoints=false)`);
                continue;
            }
            const expiryDays = config.pointExpiryDays ?? 365;
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - expiryDays);
            const members = await this.prisma.member.findMany({
                where: { tenantId: tenant.id, availablePoints: { gt: 0 }, status: 'ACTIVE' },
                orderBy: { totalPoints: 'asc' },
            });
            for (const member of members) {
                const alreadyExpired = await this.prisma.pointTransaction.aggregate({
                    where: { memberId: member.id, type: 'EXPIRE' },
                    _sum: { amount: true },
                });
                const expiredSum = Math.abs(alreadyExpired._sum.amount ?? 0);
                const availableForExpiry = member.availablePoints - expiredSum;
                if (availableForExpiry <= 0)
                    continue;
                const oldestEarns = await this.prisma.pointTransaction.findMany({
                    where: { memberId: member.id, type: 'EARN', createdAt: { lte: cutoff } },
                    orderBy: { createdAt: 'asc' },
                    take: 100,
                });
                if (oldestEarns.length === 0)
                    continue;
                const expiryAmount = oldestEarns.reduce((sum, tx) => sum + tx.amount, 0);
                const actualExpiry = Math.min(expiryAmount, availableForExpiry);
                if (actualExpiry <= 0)
                    continue;
                await this.prisma.$transaction([
                    this.prisma.pointTransaction.create({
                        data: {
                            memberId: member.id,
                            type: 'EXPIRE',
                            amount: -actualExpiry,
                            balance: member.availablePoints - actualExpiry,
                            reason: `Auto-expiry after ${expiryDays} days`,
                        },
                    }),
                    this.prisma.member.update({
                        where: { id: member.id },
                        data: { availablePoints: { decrement: actualExpiry } },
                    }),
                ]);
                totalExpired += actualExpiry;
            }
        }
        this.logger.log(`Point expiry complete. ${totalExpired} points expired.`);
    }
    async assignBirthdayBonuses() {
        this.logger.log('Running birthday bonus check...');
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const members = await this.prisma.member.findMany({
            where: {
                birthday: { not: null },
                status: 'ACTIVE',
            },
        });
        const birthdayMembers = members.filter((m) => {
            if (!m.birthday)
                return false;
            const bd = new Date(m.birthday);
            return bd.getMonth() + 1 === month && bd.getDate() === day;
        });
        if (birthdayMembers.length === 0) {
            this.logger.log('No birthdays today');
            return;
        }
        let totalBonus = 0;
        for (const member of birthdayMembers) {
            const settings = await this.settingsService.getTenantSettings(member.tenantId);
            const bonusAmount = settings.loyaltyConfig?.birthdayBonus ?? 50000;
            if (bonusAmount <= 0)
                continue;
            const existing = await this.prisma.pointTransaction.findFirst({
                where: {
                    memberId: member.id,
                    type: 'EARN',
                    reason: { contains: 'Birthday bonus' },
                    createdAt: {
                        gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                    },
                },
            });
            if (existing)
                continue;
            await this.prisma.$transaction([
                this.prisma.pointTransaction.create({
                    data: {
                        memberId: member.id,
                        type: 'EARN',
                        amount: bonusAmount,
                        balance: member.availablePoints + bonusAmount,
                        reason: 'Birthday bonus',
                    },
                }),
                this.prisma.member.update({
                    where: { id: member.id },
                    data: {
                        totalPoints: { increment: bonusAmount },
                        availablePoints: { increment: bonusAmount },
                    },
                }),
            ]);
            totalBonus += bonusAmount;
        }
        this.logger.log(`Birthday bonuses assigned: ${totalBonus} points to ${birthdayMembers.length} members`);
    }
};
exports.PointExpiryService = PointExpiryService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], PointExpiryService.prototype, "expireOldPoints", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], PointExpiryService.prototype, "assignBirthdayBonuses", null);
exports.PointExpiryService = PointExpiryService = PointExpiryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof settings_service_1.SettingsService !== "undefined" && settings_service_1.SettingsService) === "function" ? _b : Object])
], PointExpiryService);


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTenantSettings(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const rows = await this.prisma.settings.findMany({
            where: { scope: 'tenant', scopeId: tenantId },
        });
        const settings = {};
        for (const row of rows) {
            settings[row.key] = row.value;
        }
        return {
            theme: settings.theme ?? { primaryColor: '#2563eb', logoUrl: null, brandName: null },
            emailConfig: settings.emailConfig ?? { senderName: 'Loyalty Platform', senderEmail: null },
            smsConfig: settings.smsConfig ?? { enabled: false, provider: null },
            loyaltyConfig: settings.loyaltyConfig ?? { defaultPointsPerCurrency: 1, pointExpiryDays: 365, minRedeemPoints: 100, birthdayBonus: 50000, autoExpirePoints: true },
        };
    }
    async updateTenantSettings(tenantId, data) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object' && value !== null) {
                for (const [subKey, subValue] of Object.entries(value)) {
                    const fullKey = `${key}.${subKey}`;
                    await this.prisma.settings.upsert({
                        where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key: fullKey } },
                        update: { value: subValue },
                        create: { scope: 'tenant', scopeId: tenantId, key: fullKey, value: subValue },
                    });
                }
            }
            else {
                await this.prisma.settings.upsert({
                    where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key } },
                    update: { value: value },
                    create: { scope: 'tenant', scopeId: tenantId, key, value: value },
                });
            }
        }
        return this.getTenantSettings(tenantId);
    }
    async getPlatformSettings() {
        const rows = await this.prisma.settings.findMany({
            where: { scope: 'platform', scopeId: '_platform' },
        });
        const settings = { id: 'platform' };
        for (const row of rows) {
            settings[row.key] = row.value;
        }
        return {
            maintenanceMode: settings.maintenanceMode ?? false,
            defaultLanguage: settings.defaultLanguage ?? 'vi',
            currencies: settings.currencies ?? ['VND', 'USD'],
            maxTenants: settings.maxTenants ?? 100,
            features: settings.features ?? {
                referrals: true,
                gamification: true,
                notifications: true,
                analytics: true,
                importExport: true,
            },
        };
    }
    async updatePlatformSettings(data) {
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object' && value !== null) {
                for (const [subKey, subValue] of Object.entries(value)) {
                    const fullKey = `${key}.${subKey}`;
                    await this.prisma.settings.upsert({
                        where: { scope_scopeId_key: { scope: 'platform', scopeId: '_platform', key: fullKey } },
                        update: { value: subValue },
                        create: { scope: 'platform', scopeId: '_platform', key: fullKey, value: subValue },
                    });
                }
            }
            else {
                await this.prisma.settings.upsert({
                    where: { scope_scopeId_key: { scope: 'platform', scopeId: '_platform', key } },
                    update: { value: value },
                    create: { scope: 'platform', scopeId: '_platform', key, value: value },
                });
            }
        }
        return this.getPlatformSettings();
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SettingsService);


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
exports.SettingsModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_module_1 = __webpack_require__(15);
const settings_controller_1 = __webpack_require__(56);
const settings_service_1 = __webpack_require__(54);
let SettingsModule = class SettingsModule {
};
exports.SettingsModule = SettingsModule;
exports.SettingsModule = SettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [settings_controller_1.SettingsController],
        providers: [settings_service_1.SettingsService],
        exports: [settings_service_1.SettingsService],
    })
], SettingsModule);


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const settings_service_1 = __webpack_require__(54);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    getTenantSettings(tenantId) {
        return this.settingsService.getTenantSettings(tenantId);
    }
    updateTenantSettings(tenantId, body) {
        return this.settingsService.updateTenantSettings(tenantId, body);
    }
    getPlatformSettings() {
        return this.settingsService.getPlatformSettings();
    }
    updatePlatformSettings(body) {
        return this.settingsService.updatePlatformSettings(body);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)('tenant/:tenantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant settings' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getTenantSettings", null);
__decorate([
    (0, common_1.Put)('tenant/:tenantId'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tenant settings' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateTenantSettings", null);
__decorate([
    (0, common_1.Get)('platform'),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform-wide settings' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getPlatformSettings", null);
__decorate([
    (0, common_1.Put)('platform'),
    (0, roles_decorator_1.Roles)('HOST'),
    (0, swagger_1.ApiOperation)({ summary: 'Update platform-wide settings' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Record !== "undefined" && Record) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updatePlatformSettings", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('Settings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [typeof (_a = typeof settings_service_1.SettingsService !== "undefined" && settings_service_1.SettingsService) === "function" ? _a : Object])
], SettingsController);


/***/ }),
/* 57 */
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
const member_self_controller_1 = __webpack_require__(58);
const member_self_service_1 = __webpack_require__(59);
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
/* 58 */
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
const member_self_service_1 = __webpack_require__(59);
const jwt_auth_guard_1 = __webpack_require__(23);
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
    getMissions(req) {
        return this.memberSelfService.getMissions(req.user.id);
    }
    getNotifications(req) {
        return this.memberSelfService.getNotifications(req.user.id);
    }
    updateProfile(req, body) {
        return this.memberSelfService.updateProfile(req.user.id, body);
    }
    cartRedeem(req, body) {
        return this.memberSelfService.cartRedeem(req.user.id, body.items);
    }
    getTransactions(req, page, limit, type) {
        return this.memberSelfService.getTransactions(req.user.id, page || 1, limit || 50, type);
    }
    getCashback(req) {
        return this.memberSelfService.getCashback(req.user.id);
    }
    getGiftCards(req) {
        return this.memberSelfService.getGiftCards(req.user.id);
    }
    getTierProgress(req) {
        return this.memberSelfService.getTierProgress(req.user.id);
    }
    getStores(req) {
        return this.memberSelfService.getStores(req.user.id);
    }
    createFeedback(req, body) {
        return this.memberSelfService.createFeedback(req.user.id, body);
    }
    getFeedback(req) {
        return this.memberSelfService.getFeedback(req.user.id);
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
__decorate([
    (0, common_1.Get)('missions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get own missions' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getMissions", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get own notifications' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update own profile' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('cart-redeem'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem multiple rewards in one cart' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "cartRedeem", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get own point transactions (paginated, filterable)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('cashback'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get own cashback balance and transactions' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getCashback", null);
__decorate([
    (0, common_1.Get)('gift-cards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get own gift cards' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getGiftCards", null);
__decorate([
    (0, common_1.Get)('tier-progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get tier progress (current tier, next tier, points to next)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getTierProgress", null);
__decorate([
    (0, common_1.Get)('stores'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get nearby stores / store list' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getStores", null);
__decorate([
    (0, common_1.Post)('feedback'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit feedback/review' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "createFeedback", null);
__decorate([
    (0, common_1.Get)('feedback'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get own feedback history' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberSelfController.prototype, "getFeedback", null);
exports.MemberSelfController = MemberSelfController = __decorate([
    (0, swagger_1.ApiTags)('Member Self-Service'),
    (0, common_1.Controller)('me'),
    __metadata("design:paramtypes", [typeof (_a = typeof member_self_service_1.MemberSelfService !== "undefined" && member_self_service_1.MemberSelfService) === "function" ? _a : Object])
], MemberSelfController);


/***/ }),
/* 59 */
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
const bcrypt = __importStar(__webpack_require__(21));
const prisma_service_1 = __webpack_require__(16);
let MemberSelfService = class MemberSelfService {
    prisma;
    saltRounds = 12;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async hashPassword(password) {
        return bcrypt.hash(password, this.saltRounds);
    }
    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    async getProfile(memberId) {
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
            include: { tier: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const { password: _, ...data } = member;
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
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (member.password)
            throw new common_1.BadRequestException('Password already set. Use change-password instead.');
        await this.prisma.member.update({
            where: { id: memberId },
            data: { password: await this.hashPassword(password) },
        });
        return { message: 'Password set successfully' };
    }
    async changePassword(memberId, oldPassword, newPassword) {
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (!member.password)
            throw new common_1.BadRequestException('No password set. Use set-password first.');
        if (!(await this.comparePassword(oldPassword, member.password))) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        await this.prisma.member.update({
            where: { id: memberId },
            data: { password: await this.hashPassword(newPassword) },
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
        const converted = referrals.filter((r) => r.status === 'CONVERTED').length;
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
    async getMissions(memberId) {
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
            select: { tenantId: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const missions = await this.prisma.mission.findMany({
            where: { tenantId: member.tenantId },
            orderBy: { createdAt: 'desc' },
        });
        return missions;
    }
    async getNotifications(memberId) {
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
            select: { tenantId: true, email: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const notifications = await this.prisma.notificationLog.findMany({
            where: {
                tenantId: member.tenantId,
                OR: [
                    { recipient: member.email },
                    { recipient: memberId },
                ],
            },
            orderBy: { sentAt: 'desc' },
            take: 50,
        });
        return notifications;
    }
    async getTierProgress(memberId) {
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
            include: { tier: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const currentTier = member.tier;
        const allTiers = await this.prisma.tier.findMany({
            where: { tenantId: member.tenantId },
            orderBy: { minPoints: 'asc' },
        });
        const currentIndex = allTiers.findIndex(t => t.id === currentTier?.id);
        const nextTier = currentIndex >= 0 && currentIndex < allTiers.length - 1 ? allTiers[currentIndex + 1] : null;
        const progress = nextTier
            ? Math.min(100, Math.max(0, ((member.availablePoints - (currentTier?.minPoints || 0)) / (nextTier.minPoints - (currentTier?.minPoints || 0))) * 100))
            : 100;
        return {
            currentTier: currentTier ? { id: currentTier.id, name: currentTier.name, minPoints: currentTier.minPoints, color: currentTier.color } : null,
            nextTier: nextTier ? { id: nextTier.id, name: nextTier.name, minPoints: nextTier.minPoints, color: nextTier.color } : null,
            currentPoints: member.availablePoints,
            progress: Math.round(progress),
            pointsToNext: nextTier ? Math.max(0, nextTier.minPoints - member.availablePoints) : 0,
            allTiers: allTiers.map(t => ({ id: t.id, name: t.name, minPoints: t.minPoints, color: t.color })),
        };
    }
    async updateProfile(memberId, data) {
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const updateData = {};
        if (data.fullName !== undefined)
            updateData.fullName = data.fullName;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        const updated = await this.prisma.member.update({
            where: { id: memberId },
            data: updateData,
        });
        const { password: _, ...result } = updated;
        return result;
    }
    async cartRedeem(memberId, items) {
        if (!items.length)
            throw new common_1.BadRequestException('Cart is empty');
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const rewardIds = items.map(i => i.rewardId);
        const rewards = await this.prisma.reward.findMany({ where: { id: { in: rewardIds } } });
        const rewardMap = new Map(rewards.map(r => [r.id, r]));
        let totalPoints = 0;
        const voucherEntries = [];
        for (const item of items) {
            const reward = rewardMap.get(item.rewardId);
            if (!reward)
                throw new common_1.NotFoundException(`Reward ${item.rewardId} not found`);
            if (reward.quantity < item.quantity)
                throw new common_1.BadRequestException(`Reward "${reward.name}" out of stock`);
            const points = reward.pointsRequired * item.quantity;
            totalPoints += points;
            for (let i = 0; i < item.quantity; i++) {
                voucherEntries.push({
                    code: `CRT-${reward.id.slice(0, 4)}-${Date.now().toString(36).toUpperCase()}-${i}`,
                    type: reward.type,
                    value: reward.pointsRequired,
                    tenantId: member.tenantId,
                    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                });
            }
        }
        if (member.availablePoints < totalPoints) {
            throw new common_1.BadRequestException(`Insufficient points. Need ${totalPoints}, have ${member.availablePoints}`);
        }
        const createdVouchers = await this.prisma.$transaction(async (tx) => {
            await tx.pointTransaction.create({
                data: {
                    memberId,
                    type: 'BURN',
                    amount: -totalPoints,
                    balance: member.availablePoints - totalPoints,
                    reason: `Cart redemption: ${items.map(i => {
                        const r = rewardMap.get(i.rewardId);
                        return `${r?.name} x${i.quantity}`;
                    }).join(', ')}`,
                },
            });
            await tx.member.update({
                where: { id: memberId },
                data: { availablePoints: { decrement: totalPoints } },
            });
            for (const item of items) {
                await tx.reward.update({
                    where: { id: item.rewardId },
                    data: { quantity: { decrement: item.quantity } },
                });
            }
            const vouchers = await Promise.all(voucherEntries.map(v => tx.voucher.create({ data: v })));
            await Promise.all(vouchers.map(v => tx.memberVoucher.create({
                data: {
                    memberId,
                    voucherId: v.id,
                    qrCode: `QR-${v.id.slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`,
                },
            })));
            return vouchers;
        });
        return {
            vouchers: createdVouchers,
            totalPointsUsed: totalPoints,
            items: items.map(i => ({ rewardId: i.rewardId, quantity: i.quantity })),
        };
    }
    async getTransactions(memberId, page = 1, limit = 50, type) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const where = { memberId };
        if (type === 'earned')
            where.amount = { gt: 0 };
        else if (type === 'burned')
            where.amount = { lt: 0 };
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.pointTransaction.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.pointTransaction.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getCashback(memberId) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const aggregation = await this.prisma.cashbackTransaction.aggregate({
            where: { memberId },
            _sum: { amount: true },
        });
        const transactions = await this.prisma.cashbackTransaction.findMany({
            where: { memberId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return { balance: aggregation._sum.amount || 0, transactions };
    }
    async getGiftCards(memberId) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        return this.prisma.memberGiftCard.findMany({
            where: { memberId },
            include: { giftCard: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getStores(memberId) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId }, select: { tenantId: true } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        return this.prisma.store.findMany({
            where: { tenantId: member.tenantId, status: 'ACTIVE' },
            orderBy: { name: 'asc' },
        });
    }
    async createFeedback(memberId, data) {
        return this.prisma.memberFeedback.create({ data: { ...data, memberId } });
    }
    async getFeedback(memberId) {
        return this.prisma.memberFeedback.findMany({
            where: { memberId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.MemberSelfService = MemberSelfService;
exports.MemberSelfService = MemberSelfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MemberSelfService);


/***/ }),
/* 60 */
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
const member_voucher_controller_1 = __webpack_require__(61);
const member_voucher_service_1 = __webpack_require__(62);
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
/* 61 */
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
const member_voucher_service_1 = __webpack_require__(62);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let MemberVoucherController = class MemberVoucherController {
    memberVoucherService;
    constructor(memberVoucherService) {
        this.memberVoucherService = memberVoucherService;
    }
    assign(body) {
        return this.memberVoucherService.assign(body.memberId, body.voucherId);
    }
    findAll(req, memberId, page, limit, search) {
        return this.memberVoucherService.findAll(memberId, page, limit, search);
    }
    findOne(id) {
        return this.memberVoucherService.findOne(id);
    }
    remove(id) {
        return this.memberVoucherService.remove(id);
    }
    redeem(id) {
        return this.memberVoucherService.redeem(id);
    }
    validateQr(body) {
        return this.memberVoucherService.validateByQr(body.qrCode);
    }
    redeemQr(body) {
        return this.memberVoucherService.redeemByQr(body.qrCode);
    }
};
exports.MemberVoucherController = MemberVoucherController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign voucher to member' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberVoucherController.prototype, "assign", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List member-voucher assignments' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('memberId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], MemberVoucherController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member-voucher assignment by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberVoucherController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete member-voucher assignment' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberVoucherController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/redeem'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem a member voucher' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberVoucherController.prototype, "redeem", null);
__decorate([
    (0, common_1.Post)('validate-qr'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate a member voucher by QR code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberVoucherController.prototype, "validateQr", null);
__decorate([
    (0, common_1.Post)('redeem-qr'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem a member voucher by QR code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberVoucherController.prototype, "redeemQr", null);
exports.MemberVoucherController = MemberVoucherController = __decorate([
    (0, swagger_1.ApiTags)('Member Vouchers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('member-vouchers'),
    __metadata("design:paramtypes", [typeof (_a = typeof member_voucher_service_1.MemberVoucherService !== "undefined" && member_voucher_service_1.MemberVoucherService) === "function" ? _a : Object])
], MemberVoucherController);


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
exports.MemberVoucherService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const crypto_1 = __webpack_require__(63);
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
            data: { memberId, voucherId, qrCode: (0, crypto_1.randomUUID)() },
            include: { voucher: true, member: { select: { id: true, fullName: true, email: true } } },
        });
    }
    async findAll(memberId, page = 1, limit = 20, search) {
        const where = {};
        if (memberId)
            where.memberId = memberId;
        if (search) {
            where.member = {
                OR: [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            };
        }
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
    async findOne(id) {
        const mv = await this.prisma.memberVoucher.findUnique({
            where: { id },
            include: { voucher: true, member: { select: { id: true, fullName: true, email: true } } },
        });
        if (!mv)
            throw new common_1.NotFoundException('Assignment not found');
        return mv;
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.memberVoucher.delete({ where: { id } });
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
    async validateByQr(qrCode) {
        const mv = await this.prisma.memberVoucher.findUnique({
            where: { qrCode },
            include: { voucher: true, member: { select: { id: true, fullName: true, email: true } } },
        });
        if (!mv)
            throw new common_1.NotFoundException('Invalid QR code');
        if (mv.redeemed)
            throw new common_1.BadRequestException('Voucher already redeemed');
        if (mv.voucher.expiresAt && mv.voucher.expiresAt < new Date())
            throw new common_1.BadRequestException('Voucher expired');
        return { valid: true, memberVoucher: mv };
    }
    async redeemByQr(qrCode) {
        const mv = await this.prisma.memberVoucher.findUnique({
            where: { qrCode },
            include: { voucher: true },
        });
        if (!mv)
            throw new common_1.NotFoundException('Invalid QR code');
        if (mv.redeemed)
            throw new common_1.ConflictException('Voucher already redeemed');
        if (mv.voucher.expiresAt && mv.voucher.expiresAt < new Date())
            throw new common_1.BadRequestException('Voucher expired');
        return this.prisma.memberVoucher.update({
            where: { id: mv.id },
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
/* 63 */
/***/ ((module) => {

module.exports = require("crypto");

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
exports.CampaignModule = void 0;
const common_1 = __webpack_require__(2);
const campaign_service_1 = __webpack_require__(65);
const campaign_controller_1 = __webpack_require__(66);
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
exports.CampaignService = void 0;
const common_1 = __webpack_require__(2);
const schedule_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let CampaignService = class CampaignService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        if (startDate >= endDate)
            throw new common_1.BadRequestException('startDate must be before endDate');
        return this.prisma.campaign.create({ data: { ...data, startDate, endDate } });
    }
    async findAll(tenantId, page = 1, limit = 20, status, search, sort) {
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
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.campaign.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
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
    async getPerformance(id) {
        const campaign = await this.findOne(id);
        const [earnedInRange, membersEnrolled, vouchersRedeemed] = await Promise.all([
            this.prisma.pointTransaction.count({
                where: {
                    type: 'EARN',
                    createdAt: { gte: campaign.startDate, lte: campaign.endDate },
                    member: { tenantId: campaign.tenantId },
                },
            }),
            this.prisma.member.count({
                where: {
                    tenantId: campaign.tenantId,
                    createdAt: { gte: campaign.startDate, lte: campaign.endDate },
                },
            }),
            this.prisma.memberVoucher.count({
                where: {
                    createdAt: { gte: campaign.startDate, lte: campaign.endDate },
                    voucher: { tenantId: campaign.tenantId },
                },
            }),
        ]);
        const pointsDistributed = await this.prisma.pointTransaction.aggregate({
            where: {
                type: 'EARN',
                createdAt: { gte: campaign.startDate, lte: campaign.endDate },
                member: { tenantId: campaign.tenantId },
            },
            _sum: { amount: true },
        });
        return {
            earnedTransactions: earnedInRange,
            membersEnrolled,
            vouchersRedeemed,
            pointsDistributed: pointsDistributed._sum.amount || 0,
            daysRunning: Math.ceil((Math.min(campaign.endDate.getTime(), Date.now()) - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24)),
        };
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampaignController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const campaign_service_1 = __webpack_require__(65);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const create_campaign_dto_1 = __webpack_require__(67);
let CampaignController = class CampaignController {
    campaignService;
    constructor(campaignService) {
        this.campaignService = campaignService;
    }
    create(req, body) {
        return this.campaignService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
    }
    findAll(req, query) {
        return this.campaignService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.status, query.search, query.sort);
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
    getPerformance(id) {
        return this.campaignService.getPerformance(id);
    }
};
exports.CampaignController = CampaignController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a campaign' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_campaign_dto_1.CreateCampaignDto !== "undefined" && create_campaign_dto_1.CreateCampaignDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List campaigns (with pagination & sort)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof create_campaign_dto_1.CampaignQueryDto !== "undefined" && create_campaign_dto_1.CampaignQueryDto) === "function" ? _c : Object]),
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update campaign' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof create_campaign_dto_1.UpdateCampaignDto !== "undefined" && create_campaign_dto_1.UpdateCampaignDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete campaign' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/performance'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign performance metrics' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "getPerformance", null);
exports.CampaignController = CampaignController = __decorate([
    (0, swagger_1.ApiTags)('Campaigns'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('campaigns'),
    __metadata("design:paramtypes", [typeof (_a = typeof campaign_service_1.CampaignService !== "undefined" && campaign_service_1.CampaignService) === "function" ? _a : Object])
], CampaignController);


/***/ }),
/* 67 */
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
exports.CampaignQueryDto = exports.UpdateCampaignDto = exports.CreateCampaignDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
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
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCampaignDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "tenantId", void 0);
class UpdateCampaignDto {
    name;
    description;
    status;
    budget;
}
exports.UpdateCampaignDto = UpdateCampaignDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateCampaignDto.prototype, "budget", void 0);
class CampaignQueryDto {
    tenantId;
    page;
    limit;
    search;
    status;
    sort;
}
exports.CampaignQueryDto = CampaignQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CampaignQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CampaignQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CampaignQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CampaignQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CampaignQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CampaignQueryDto.prototype, "sort", void 0);


/***/ }),
/* 68 */
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
const reward_service_1 = __webpack_require__(69);
const reward_controller_1 = __webpack_require__(70);
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
/* 69 */
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
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let RewardService = class RewardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.reward.create({ data });
    }
    async findAll(tenantId, page = 1, limit = 20, search, sort, type) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (type)
            where.type = type;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.reward.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
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
    async getRedemptionStats(id) {
        const reward = await this.findOne(id);
        const [transactions, memberVouchers] = await Promise.all([
            this.prisma.pointTransaction.findMany({
                where: { reason: { contains: `Redeemed reward: ${reward.name}` } },
                orderBy: { createdAt: 'desc' },
                take: 20,
                include: { member: { select: { id: true, fullName: true, email: true } } },
            }),
            this.prisma.voucher.findMany({
                where: { code: { startsWith: `RWD-${reward.id.slice(0, 6)}` } },
                include: { memberVouchers: { include: { member: { select: { id: true, fullName: true, email: true } } }, take: 1 } },
            }),
        ]);
        const totalRedemptions = await this.prisma.pointTransaction.count({
            where: { reason: { contains: `Redeemed reward: ${reward.name}` } },
        });
        return {
            totalRedemptions,
            recentRedemptions: transactions.map(t => ({
                memberId: t.memberId,
                fullName: t.member?.fullName || 'Unknown',
                email: t.member?.email || '',
                pointsUsed: Math.abs(t.amount),
                createdAt: t.createdAt,
            })),
        };
    }
};
exports.RewardService = RewardService;
exports.RewardService = RewardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], RewardService);


/***/ }),
/* 70 */
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
exports.RewardController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const reward_service_1 = __webpack_require__(69);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const create_reward_dto_1 = __webpack_require__(71);
let RewardController = class RewardController {
    rewardService;
    constructor(rewardService) {
        this.rewardService = rewardService;
    }
    create(req, body) {
        return this.rewardService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
    }
    findAll(req, query) {
        return this.rewardService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.sort, query.type);
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
    getRedemptionStats(id) {
        return this.rewardService.getRedemptionStats(id);
    }
};
exports.RewardController = RewardController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a reward' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_reward_dto_1.CreateRewardDto !== "undefined" && create_reward_dto_1.CreateRewardDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], RewardController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List rewards (with pagination & sort & type filter)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof create_reward_dto_1.RewardQueryDto !== "undefined" && create_reward_dto_1.RewardQueryDto) === "function" ? _c : Object]),
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem reward with member points' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof create_reward_dto_1.RedeemRewardDto !== "undefined" && create_reward_dto_1.RedeemRewardDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], RewardController.prototype, "redeem", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update reward' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof create_reward_dto_1.UpdateRewardDto !== "undefined" && create_reward_dto_1.UpdateRewardDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], RewardController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete reward' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RewardController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/redemptions'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reward redemption history' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RewardController.prototype, "getRedemptionStats", null);
exports.RewardController = RewardController = __decorate([
    (0, swagger_1.ApiTags)('Rewards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('rewards'),
    __metadata("design:paramtypes", [typeof (_a = typeof reward_service_1.RewardService !== "undefined" && reward_service_1.RewardService) === "function" ? _a : Object])
], RewardController);


/***/ }),
/* 71 */
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
exports.RewardQueryDto = exports.RedeemRewardDto = exports.UpdateRewardDto = exports.CreateRewardDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
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
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRewardDto.prototype, "pointsRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
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
class UpdateRewardDto {
    name;
    description;
    pointsRequired;
    quantity;
    imageUrl;
}
exports.UpdateRewardDto = UpdateRewardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRewardDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRewardDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateRewardDto.prototype, "pointsRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateRewardDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRewardDto.prototype, "imageUrl", void 0);
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
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RedeemRewardDto.prototype, "quantity", void 0);
class RewardQueryDto {
    tenantId;
    page;
    limit;
    search;
    sort;
    type;
}
exports.RewardQueryDto = RewardQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RewardQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RewardQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RewardQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RewardQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RewardQueryDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RewardQueryDto.prototype, "type", void 0);


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
exports.VoucherModule = void 0;
const common_1 = __webpack_require__(2);
const voucher_service_1 = __webpack_require__(73);
const voucher_controller_1 = __webpack_require__(74);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VoucherService = void 0;
const common_1 = __webpack_require__(2);
const schedule_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
const crypto_1 = __webpack_require__(63);
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
    async findAll(tenantId, page = 1, limit = 20, search, sort) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { type: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.voucher.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
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
    async batchGenerate(data) {
        const codes = [];
        const entries = [];
        for (let i = 0; i < data.count; i++) {
            const suffix = (0, crypto_1.randomBytes)(3).toString('hex').toUpperCase();
            const code = `${data.prefix}-${suffix}`;
            codes.push(code);
            entries.push({
                code,
                type: data.type,
                value: data.value,
                maxUsage: data.maxUsage,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                tenantId: data.tenantId,
            });
        }
        await this.prisma.voucher.createMany({ data: entries, skipDuplicates: true });
        return { generated: codes.length, codes };
    }
    async autoExpireVouchers() {
        const now = new Date();
        const result = await this.prisma.voucher.updateMany({
            where: { expiresAt: { lt: now }, NOT: { expiresAt: null } },
            data: { maxUsage: 0 },
        });
        return { expired: result.count };
    }
    async getExpiredStats(tenantId) {
        const now = new Date();
        const where = tenantId ? { tenantId, expiresAt: { lt: now } } : { expiresAt: { lt: now } };
        const total = await this.prisma.voucher.count({ where });
        const withRedemptions = await this.prisma.voucher.count({
            where: { ...where, usedCount: { gt: 0 } },
        });
        return { totalExpired: total, hadRedemptions: withRedemptions };
    }
};
exports.VoucherService = VoucherService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VoucherService.prototype, "autoExpireVouchers", null);
exports.VoucherService = VoucherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], VoucherService);


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VoucherController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const voucher_service_1 = __webpack_require__(73);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const create_voucher_dto_1 = __webpack_require__(75);
let VoucherController = class VoucherController {
    voucherService;
    constructor(voucherService) {
        this.voucherService = voucherService;
    }
    create(req, body) {
        return this.voucherService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
    }
    findAll(req, query) {
        return this.voucherService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.sort);
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
    batchGenerate(body) {
        return this.voucherService.batchGenerate(body);
    }
    getExpiredStats(tenantId) {
        return this.voucherService.getExpiredStats(tenantId);
    }
};
exports.VoucherController = VoucherController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a voucher' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_voucher_dto_1.CreateVoucherDto !== "undefined" && create_voucher_dto_1.CreateVoucherDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List vouchers (with pagination & sort)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof create_voucher_dto_1.VoucherQueryDto !== "undefined" && create_voucher_dto_1.VoucherQueryDto) === "function" ? _c : Object]),
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
    __metadata("design:paramtypes", [typeof (_d = typeof create_voucher_dto_1.ValidateVoucherDto !== "undefined" && create_voucher_dto_1.ValidateVoucherDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)(':id/redeem'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem/use a voucher' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "redeem", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update voucher' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof create_voucher_dto_1.UpdateVoucherDto !== "undefined" && create_voucher_dto_1.UpdateVoucherDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete voucher' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('batch-generate'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Batch generate vouchers' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof create_voucher_dto_1.BatchGenerateVoucherDto !== "undefined" && create_voucher_dto_1.BatchGenerateVoucherDto) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "batchGenerate", null);
__decorate([
    (0, common_1.Get)('stats/expired'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Get expired voucher stats' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "getExpiredStats", null);
exports.VoucherController = VoucherController = __decorate([
    (0, swagger_1.ApiTags)('Vouchers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('vouchers'),
    __metadata("design:paramtypes", [typeof (_a = typeof voucher_service_1.VoucherService !== "undefined" && voucher_service_1.VoucherService) === "function" ? _a : Object])
], VoucherController);


/***/ }),
/* 75 */
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
exports.BatchGenerateVoucherDto = exports.VoucherQueryDto = exports.ValidateVoucherDto = exports.UpdateVoucherDto = exports.CreateVoucherDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
const class_transformer_1 = __webpack_require__(76);
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
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVoucherDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVoucherDto.prototype, "maxUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "tenantId", void 0);
class UpdateVoucherDto {
    value;
    maxUsage;
    expiresAt;
}
exports.UpdateVoucherDto = UpdateVoucherDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateVoucherDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateVoucherDto.prototype, "maxUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateVoucherDto.prototype, "expiresAt", void 0);
class ValidateVoucherDto {
    code;
}
exports.ValidateVoucherDto = ValidateVoucherDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateVoucherDto.prototype, "code", void 0);
class VoucherQueryDto {
    tenantId;
    page;
    limit;
    search;
    sort;
}
exports.VoucherQueryDto = VoucherQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoucherQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], VoucherQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], VoucherQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoucherQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoucherQueryDto.prototype, "sort", void 0);
class BatchGenerateVoucherDto {
    prefix;
    count;
    type;
    value;
    maxUsage;
    expiresAt;
    tenantId;
}
exports.BatchGenerateVoucherDto = BatchGenerateVoucherDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BatchGenerateVoucherDto.prototype, "prefix", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BatchGenerateVoucherDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BatchGenerateVoucherDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BatchGenerateVoucherDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BatchGenerateVoucherDto.prototype, "maxUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BatchGenerateVoucherDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BatchGenerateVoucherDto.prototype, "tenantId", void 0);


/***/ }),
/* 76 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 77 */
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
const promotion_service_1 = __webpack_require__(78);
const promotion_controller_1 = __webpack_require__(79);
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
/* 78 */
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
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let PromotionService = class PromotionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.promotion.create({ data });
    }
    async findAll(tenantId, page = 1, limit = 20, search, sort, status) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status) {
            where.status = status;
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.promotion.findMany({ where, orderBy: sort ? { [orderBy]: orderDirection } : { priority: 'asc' }, skip, take: limit }),
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromotionController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const promotion_service_1 = __webpack_require__(78);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const create_promotion_dto_1 = __webpack_require__(80);
let PromotionController = class PromotionController {
    promotionService;
    constructor(promotionService) {
        this.promotionService = promotionService;
    }
    create(req, body) {
        return this.promotionService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
    }
    findAll(req, query) {
        return this.promotionService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.sort, query.status);
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a promotion rule' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_promotion_dto_1.CreatePromotionDto !== "undefined" && create_promotion_dto_1.CreatePromotionDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PromotionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List promotion rules (with pagination & sort)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof create_promotion_dto_1.PromotionQueryDto !== "undefined" && create_promotion_dto_1.PromotionQueryDto) === "function" ? _c : Object]),
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update promotion rule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof create_promotion_dto_1.UpdatePromotionDto !== "undefined" && create_promotion_dto_1.UpdatePromotionDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], PromotionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromotionQueryDto = exports.UpdatePromotionDto = exports.CreatePromotionDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
class CreatePromotionDto {
    name;
    description;
    priority;
    conditions;
    actions;
    tenantId;
}
exports.CreatePromotionDto = CreatePromotionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePromotionDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePromotionDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePromotionDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "tenantId", void 0);
class UpdatePromotionDto {
    name;
    description;
    priority;
    status;
    conditions;
    actions;
}
exports.UpdatePromotionDto = UpdatePromotionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePromotionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePromotionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePromotionDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePromotionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePromotionDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePromotionDto.prototype, "actions", void 0);
class PromotionQueryDto {
    tenantId;
    page;
    limit;
    search;
    status;
    sort;
}
exports.PromotionQueryDto = PromotionQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromotionQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PromotionQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PromotionQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromotionQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromotionQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromotionQueryDto.prototype, "sort", void 0);


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
exports.ReferralModule = void 0;
const common_1 = __webpack_require__(2);
const referral_service_1 = __webpack_require__(82);
const referral_controller_1 = __webpack_require__(83);
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
/* 82 */
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
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
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
    async findAll(tenantId, page = 1, limit = 20, search, sort, status) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status) {
            where.status = status;
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.referral.findMany({
                where,
                include: { referrer: true, referee: true },
                orderBy: { [orderBy]: orderDirection },
                skip,
                take: limit,
            }),
            this.prisma.referral.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const referral = await this.prisma.referral.findUnique({
            where: { id },
            include: { referrer: true, referee: true },
        });
        if (!referral)
            throw new common_1.NotFoundException('Referral not found');
        return referral;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.referral.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.referral.delete({ where: { id } });
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
/* 83 */
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
exports.ReferralController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const referral_service_1 = __webpack_require__(82);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const common_dto_1 = __webpack_require__(24);
let ReferralController = class ReferralController {
    referralService;
    constructor(referralService) {
        this.referralService = referralService;
    }
    createLink(body) {
        return this.referralService.createLink(body.referrerId, body.tenantId);
    }
    findAll(tenantId, page, limit, search, sort, status) {
        return this.referralService.findAll(tenantId, page, limit, search, sort, status);
    }
    getStats(tenantId) {
        return this.referralService.getStats(tenantId);
    }
    findOne(id) {
        return this.referralService.findOne(id);
    }
    update(id, body) {
        return this.referralService.update(id, body);
    }
    remove(id) {
        return this.referralService.remove(id);
    }
    convert(id, body) {
        return this.referralService.convertReferral(id, body.refereeId);
    }
};
exports.ReferralController = ReferralController;
__decorate([
    (0, common_1.Post)('links'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Create referral link' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof common_dto_1.CreateReferralLinkDto !== "undefined" && common_dto_1.CreateReferralLinkDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "createLink", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List referrals (with pagination & sort)' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('sort')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String]),
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
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get referral by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update referral' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete referral' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/convert'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark referral as converted and reward referrer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof common_dto_1.ConvertReferralDto !== "undefined" && common_dto_1.ConvertReferralDto) === "function" ? _c : Object]),
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
/* 84 */
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
const gamification_service_1 = __webpack_require__(85);
const gamification_controller_1 = __webpack_require__(86);
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
/* 85 */
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
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let GamificationService = class GamificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    createBadge(data) {
        return this.prisma.badge.create({ data });
    }
    async findAllBadges(tenantId, page = 1, limit = 20, search, sort) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.badge.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
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
    async findOneBadge(id) {
        const badge = await this.prisma.badge.findUnique({ where: { id } });
        if (!badge)
            throw new common_1.NotFoundException('Badge not found');
        return badge;
    }
    async findBadge(id) {
        return this.findOneBadge(id);
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
    async findAllMissions(tenantId, page = 1, limit = 20, search, sort) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.mission.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
            this.prisma.mission.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOneMission(id) {
        const mission = await this.prisma.mission.findUnique({ where: { id } });
        if (!mission)
            throw new common_1.NotFoundException('Mission not found');
        return mission;
    }
    async updateMission(id, data) {
        await this.findOneMission(id);
        return this.prisma.mission.update({ where: { id }, data });
    }
    async removeMission(id) {
        await this.findOneMission(id);
        return this.prisma.mission.delete({ where: { id } });
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], GamificationService);


/***/ }),
/* 86 */
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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamificationController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const gamification_service_1 = __webpack_require__(85);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const create_gamification_dto_1 = __webpack_require__(87);
let GamificationController = class GamificationController {
    gamificationService;
    constructor(gamificationService) {
        this.gamificationService = gamificationService;
    }
    createBadge(body) {
        return this.gamificationService.createBadge(body);
    }
    findAllBadges(query) {
        return this.gamificationService.findAllBadges(query.tenantId, query.page, query.limit, query.search, query.sort);
    }
    findOneBadge(id) {
        return this.gamificationService.findOneBadge(id);
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
    findAllMissions(query) {
        return this.gamificationService.findAllMissions(query.tenantId, query.page, query.limit, query.search, query.sort);
    }
    findOneMission(id) {
        return this.gamificationService.findOneMission(id);
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a badge' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_gamification_dto_1.CreateBadgeDto !== "undefined" && create_gamification_dto_1.CreateBadgeDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "createBadge", null);
__decorate([
    (0, common_1.Get)('badges'),
    (0, swagger_1.ApiOperation)({ summary: 'List badges (with pagination & sort)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_gamification_dto_1.BadgeQueryDto !== "undefined" && create_gamification_dto_1.BadgeQueryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "findAllBadges", null);
__decorate([
    (0, common_1.Get)('badges/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get badge by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "findOneBadge", null);
__decorate([
    (0, common_1.Put)('badges/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update badge' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof create_gamification_dto_1.UpdateBadgeDto !== "undefined" && create_gamification_dto_1.UpdateBadgeDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "updateBadge", null);
__decorate([
    (0, common_1.Delete)('badges/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete badge' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "removeBadge", null);
__decorate([
    (0, common_1.Post)('missions'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a mission' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof create_gamification_dto_1.CreateMissionDto !== "undefined" && create_gamification_dto_1.CreateMissionDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "createMission", null);
__decorate([
    (0, common_1.Get)('missions'),
    (0, swagger_1.ApiOperation)({ summary: 'List missions (with pagination & sort)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof create_gamification_dto_1.MissionQueryDto !== "undefined" && create_gamification_dto_1.MissionQueryDto) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "findAllMissions", null);
__decorate([
    (0, common_1.Get)('missions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get mission by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "findOneMission", null);
__decorate([
    (0, common_1.Put)('missions/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update mission' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_g = typeof create_gamification_dto_1.UpdateMissionDto !== "undefined" && create_gamification_dto_1.UpdateMissionDto) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "updateMission", null);
__decorate([
    (0, common_1.Delete)('missions/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
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
/* 87 */
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
exports.MissionQueryDto = exports.UpdateMissionDto = exports.CreateMissionDto = exports.BadgeQueryDto = exports.UpdateBadgeDto = exports.CreateBadgeDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
class CreateBadgeDto {
    name;
    description;
    iconUrl;
    criteria;
    tenantId;
}
exports.CreateBadgeDto = CreateBadgeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "iconUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateBadgeDto.prototype, "criteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "tenantId", void 0);
class UpdateBadgeDto {
    name;
    description;
    iconUrl;
    criteria;
}
exports.UpdateBadgeDto = UpdateBadgeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBadgeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBadgeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBadgeDto.prototype, "iconUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateBadgeDto.prototype, "criteria", void 0);
class BadgeQueryDto {
    tenantId;
    page;
    limit;
    search;
    sort;
}
exports.BadgeQueryDto = BadgeQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BadgeQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BadgeQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BadgeQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BadgeQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BadgeQueryDto.prototype, "sort", void 0);
class CreateMissionDto {
    name;
    description;
    pointsReward;
    criteria;
    startDate;
    endDate;
    tenantId;
}
exports.CreateMissionDto = CreateMissionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMissionDto.prototype, "pointsReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateMissionDto.prototype, "criteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "tenantId", void 0);
class UpdateMissionDto {
    name;
    description;
    pointsReward;
    criteria;
    startDate;
    endDate;
}
exports.UpdateMissionDto = UpdateMissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMissionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMissionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateMissionDto.prototype, "pointsReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateMissionDto.prototype, "criteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateMissionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateMissionDto.prototype, "endDate", void 0);
class MissionQueryDto {
    tenantId;
    page;
    limit;
    search;
    sort;
}
exports.MissionQueryDto = MissionQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MissionQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MissionQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MissionQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MissionQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MissionQueryDto.prototype, "sort", void 0);


/***/ }),
/* 88 */
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
const dashboard_service_1 = __webpack_require__(89);
const dashboard_controller_1 = __webpack_require__(90);
const common_module_1 = __webpack_require__(46);
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
    })
], DashboardModule);


/***/ }),
/* 89 */
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const cache_service_1 = __webpack_require__(47);
let DashboardService = class DashboardService {
    prisma;
    cache;
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async getStats(tenantId) {
        const cacheKey = tenantId ? `dashboard:stats:${tenantId}` : 'dashboard:stats:global';
        const cached = await this.cache.get(cacheKey);
        if (cached)
            return cached;
        try {
            const tenantFilter = tenantId ? { tenantId } : {};
            const [tenants, members, activeCampaigns, rewards, vouchers, totalPoints, promotions, badges, missions, referrals, tiersWithMembers, membersByStatus, kycCount, activeVouchers,] = await Promise.all([
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
                this.prisma.member.groupBy({ by: ['status'], where: tenantFilter, _count: true }),
                this.prisma.member.count({ where: { ...tenantFilter, kycVerified: true } }),
                this.prisma.memberVoucher.count({ where: { redeemed: false, ...(tenantId ? { member: { tenantId } } : {}) } }),
            ]);
            const statusBreakdown = membersByStatus.reduce((acc, cur) => {
                acc[cur.status] = cur._count;
                return acc;
            }, {});
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const ptWhere = { createdAt: { gte: today }, ...(tenantId ? { member: { tenantId } } : {}) };
            const [earnedToday, burnedToday, newMembersToday, redeemedToday] = await Promise.all([
                this.prisma.pointTransaction.aggregate({
                    where: { ...ptWhere, amount: { gt: 0 } },
                    _sum: { amount: true },
                }),
                this.prisma.pointTransaction.aggregate({
                    where: { ...ptWhere, amount: { lt: 0 } },
                    _sum: { amount: true },
                }),
                this.prisma.member.count({
                    where: { createdAt: { gte: today }, ...(tenantId ? { tenantId } : {}) },
                }),
                this.prisma.memberVoucher.count({
                    where: { redeemedAt: { gte: today }, ...(tenantId ? { member: { tenantId } } : {}) },
                }),
            ]);
            const result = {
                tenants, members, activeCampaigns, rewards, vouchers,
                totalPoints: totalPoints._sum.totalPoints || 0,
                promotions, badges, missions, referrals,
                kycRate: members > 0 ? Math.round((kycCount / members) * 100) : 0,
                activeVouchers,
                membersByStatus: statusBreakdown,
                tiers: tiersWithMembers.map(t => ({ name: t.name, color: t.color, memberCount: t._count.members })),
                today: {
                    earned: earnedToday._sum.amount || 0,
                    burned: Math.abs(burnedToday._sum.amount || 0),
                    newMembers: newMembersToday,
                    redemptions: redeemedToday,
                },
            };
            this.cache.set(cacheKey, result, 120);
            return result;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to load dashboard stats');
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof cache_service_1.CacheService !== "undefined" && cache_service_1.CacheService) === "function" ? _b : Object])
], DashboardService);


/***/ }),
/* 90 */
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
const dashboard_service_1 = __webpack_require__(89);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
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
/* 91 */
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
const upload_controller_1 = __webpack_require__(92);
const upload_service_1 = __webpack_require__(93);
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
/* 92 */
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
const platform_express_1 = __webpack_require__(6);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const upload_service_1 = __webpack_require__(93);
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024;
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
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: MAX_SIZE },
        fileFilter: (_req, file, cb) => {
            if (!ALLOWED_TYPES.includes(file.mimetype)) {
                cb(new common_1.BadRequestException(`File type ${file.mimetype} is not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}`), false);
            }
            else {
                cb(null, true);
            }
        },
    })),
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
/* 93 */
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
const fs = __importStar(__webpack_require__(94));
const path = __importStar(__webpack_require__(95));
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
/* 94 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 95 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 96 */
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
const analytics_controller_1 = __webpack_require__(97);
const analytics_service_1 = __webpack_require__(98);
const common_module_1 = __webpack_require__(46);
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule],
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [analytics_service_1.AnalyticsService],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);


/***/ }),
/* 97 */
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
const analytics_service_1 = __webpack_require__(98);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
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
    getExpiringPoints(tenantId) {
        return this.analyticsService.getExpiringPoints(tenantId);
    }
    getLeaderboard(limit, tenantId) {
        return this.analyticsService.getLeaderboard(tenantId, limit || 20);
    }
    getVoucherAnalytics(days, tenantId) {
        return this.analyticsService.getVoucherAnalytics(days || 30, tenantId);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('points-trend'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Points earned/burned over time (daily)' }),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getPointsTrend", null);
__decorate([
    (0, common_1.Get)('member-growth'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'New member registrations over time (daily)' }),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getMemberGrowth", null);
__decorate([
    (0, common_1.Get)('campaign-performance'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Campaign performance metrics' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getCampaignPerformance", null);
__decorate([
    (0, common_1.Get)('top-members'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Top members by points' }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getTopMembers", null);
__decorate([
    (0, common_1.Get)('voucher-stats'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Voucher usage statistics' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getVoucherStats", null);
__decorate([
    (0, common_1.Get)('expiring-points'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Members with points nearing expiry' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getExpiringPoints", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Member leaderboard ranked by points' }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('voucher-analytics'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Voucher usage analytics (daily trend, popular, by type)' }),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getVoucherAnalytics", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [typeof (_a = typeof analytics_service_1.AnalyticsService !== "undefined" && analytics_service_1.AnalyticsService) === "function" ? _a : Object])
], AnalyticsController);


/***/ }),
/* 98 */
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const cache_service_1 = __webpack_require__(47);
let AnalyticsService = class AnalyticsService {
    prisma;
    cache;
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async getPointsTrend(days, tenantId) {
        try {
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
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to load points trend');
        }
    }
    async getMemberGrowth(days, tenantId) {
        try {
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
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to load member growth');
        }
    }
    async getCampaignPerformance(tenantId) {
        const cacheKey = tenantId ? `analytics:campaigns:${tenantId}` : 'analytics:campaigns:global';
        const cached = await this.cache.get(cacheKey);
        if (cached)
            return cached;
        try {
            const where = tenantId ? { tenantId } : {};
            const campaigns = await this.prisma.campaign.findMany({ where });
            const total = campaigns.length;
            const active = campaigns.filter(c => c.status === 'ACTIVE').length;
            const completed = campaigns.filter(c => c.status === 'ENDED').length;
            const result = { total, active, completed, draft: total - active - completed };
            this.cache.set(cacheKey, result, 180);
            return result;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to load campaign performance');
        }
    }
    async getTopMembers(limit, tenantId) {
        const cacheKey = tenantId ? `analytics:topmembers:${tenantId}:${limit}` : `analytics:topmembers:global:${limit}`;
        const cached = await this.cache.get(cacheKey);
        if (cached)
            return cached;
        try {
            const where = tenantId ? { tenantId } : {};
            const result = await this.prisma.member.findMany({
                where, orderBy: { totalPoints: 'desc' }, take: limit,
                include: { tier: { select: { name: true, color: true } } },
            });
            this.cache.set(cacheKey, result, 120);
            return result;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to load top members');
        }
    }
    async getVoucherStats(tenantId) {
        const cacheKey = tenantId ? `analytics:vouchers:${tenantId}` : 'analytics:vouchers:global';
        const cached = await this.cache.get(cacheKey);
        if (cached)
            return cached;
        try {
            const where = tenantId ? { tenantId } : {};
            const total = await this.prisma.voucher.count({ where });
            const used = await this.prisma.voucher.count({ where: { ...where, usedCount: { gt: 0 } } });
            const result = { total, used, remaining: total - used, usageRate: total > 0 ? ((used / total) * 100).toFixed(1) : '0' };
            this.cache.set(cacheKey, result, 180);
            return result;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to load voucher stats');
        }
    }
    async getExpiringPoints(tenantId) {
        try {
            const where = tenantId ? { tenantId } : {};
            const members = await this.prisma.member.findMany({
                where: { ...where, availablePoints: { gt: 0 } },
                select: { id: true, fullName: true, email: true, availablePoints: true, totalPoints: true },
                orderBy: { availablePoints: 'desc' },
                take: 10,
            });
            const membersWithExpiry = await Promise.all(members.map(async (m) => {
                const oldestEarn = await this.prisma.pointTransaction.findFirst({
                    where: { memberId: m.id, type: 'EARN' },
                    orderBy: { createdAt: 'asc' },
                });
                return {
                    ...m,
                    oldestEarnDate: oldestEarn?.createdAt || null,
                    daysSinceOldestEarn: oldestEarn
                        ? Math.floor((Date.now() - oldestEarn.createdAt.getTime()) / (1000 * 60 * 60 * 24))
                        : null,
                };
            }));
            return membersWithExpiry.filter(m => m.daysSinceOldestEarn !== null && m.daysSinceOldestEarn > 300);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to load expiring points');
        }
    }
    async getLeaderboard(tenantId, limit = 20) {
        const cacheKey = tenantId ? `analytics:leaderboard:${tenantId}:${limit}` : `analytics:leaderboard:global:${limit}`;
        const cached = await this.cache.get(cacheKey);
        if (cached)
            return cached;
        try {
            const where = tenantId ? { tenantId } : {};
            if (tenantId)
                where.tenantId = tenantId;
            const members = await this.prisma.member.findMany({
                where,
                orderBy: { totalPoints: 'desc' },
                take: limit,
                include: { tier: { select: { name: true, color: true } } },
            });
            const result = members.map((m, i) => ({
                rank: i + 1,
                id: m.id,
                fullName: m.fullName,
                email: m.email,
                totalPoints: m.totalPoints,
                availablePoints: m.availablePoints,
                tier: m.tier?.name || 'Bronze',
                tierColor: m.tier?.color || '#94a3b8',
            }));
            this.cache.set(cacheKey, result, 120);
            return result;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to load leaderboard');
        }
    }
    async getVoucherAnalytics(days = 30, tenantId) {
        try {
            const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            const memberVoucherWhere = { redeemedAt: { gte: since } };
            if (tenantId)
                memberVoucherWhere.member = { tenantId };
            const redemptions = await this.prisma.memberVoucher.findMany({
                where: memberVoucherWhere,
                include: { voucher: { select: { code: true, type: true, value: true } } },
                orderBy: { redeemedAt: 'asc' },
            });
            const daily = {};
            const typeCount = {};
            const popular = {};
            for (const r of redemptions) {
                const day = r.redeemedAt.toISOString().slice(0, 10);
                daily[day] = (daily[day] || 0) + 1;
                typeCount[r.voucher.type] = (typeCount[r.voucher.type] || 0) + 1;
                const key = r.voucher.code;
                if (!popular[key])
                    popular[key] = { code: key, count: 0, value: r.voucher.value };
                popular[key].count++;
            }
            return {
                totalRedemptions: redemptions.length,
                dailyTrend: Object.entries(daily).map(([date, count]) => ({ date, count })),
                byType: Object.entries(typeCount).map(([type, count]) => ({ type, count })),
                popular: Object.values(popular).sort((a, b) => b.count - a.count).slice(0, 10),
            };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to load voucher analytics');
        }
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof cache_service_1.CacheService !== "undefined" && cache_service_1.CacheService) === "function" ? _b : Object])
], AnalyticsService);


/***/ }),
/* 99 */
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
const notification_controller_1 = __webpack_require__(100);
const notification_service_1 = __webpack_require__(101);
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
/* 100 */
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
exports.NotificationController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const notification_service_1 = __webpack_require__(101);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const common_dto_1 = __webpack_require__(24);
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    createTemplate(body) {
        return this.notificationService.createTemplate(body);
    }
    listTemplates(tenantId, page, limit, search, sort) {
        return this.notificationService.listTemplates(tenantId, page, limit, search, sort);
    }
    findTemplateOne(id) {
        return this.notificationService.findTemplateOne(id);
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
    broadcast(body) {
        return this.notificationService.broadcast(body);
    }
    listLogs(tenantId, page, limit, search, sort) {
        return this.notificationService.listLogs(tenantId, page, limit, search, sort);
    }
    findLogOne(id) {
        return this.notificationService.findLogOne(id);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Post)('templates'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a notification template' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof common_dto_1.CreateNotificationTemplateDto !== "undefined" && common_dto_1.CreateNotificationTemplateDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'List notification templates' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "listTemplates", null);
__decorate([
    (0, common_1.Get)('templates/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification template by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findTemplateOne", null);
__decorate([
    (0, common_1.Put)('templates/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update notification template' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof Partial !== "undefined" && Partial) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete notification template' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "deleteTemplate", null);
__decorate([
    (0, common_1.Post)('send'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a notification (email/SMS)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof common_dto_1.SendNotificationDto !== "undefined" && common_dto_1.SendNotificationDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "send", null);
__decorate([
    (0, common_1.Post)('broadcast'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Broadcast notification to all active members of a tenant' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof common_dto_1.BroadcastNotificationDto !== "undefined" && common_dto_1.BroadcastNotificationDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "broadcast", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiOperation)({ summary: 'List notification logs' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "listLogs", null);
__decorate([
    (0, common_1.Get)('logs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification log by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findLogOne", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [typeof (_a = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _a : Object])
], NotificationController);


/***/ }),
/* 101 */
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
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let NotificationService = class NotificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTemplate(data) {
        return this.prisma.notificationTemplate.create({ data });
    }
    async listTemplates(tenantId, page = 1, limit = 20, search, sort) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.notificationTemplate.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
            this.prisma.notificationTemplate.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findTemplateOne(id) {
        const template = await this.prisma.notificationTemplate.findUnique({ where: { id } });
        if (!template)
            throw new common_1.NotFoundException('Notification template not found');
        return template;
    }
    async updateTemplate(id, data) {
        await this.findTemplateOne(id);
        return this.prisma.notificationTemplate.update({ where: { id }, data });
    }
    async deleteTemplate(id) {
        await this.findTemplateOne(id);
        await this.prisma.notificationTemplate.delete({ where: { id } });
        return { deleted: true };
    }
    async send(data) {
        const template = await this.prisma.notificationTemplate.findUnique({ where: { id: data.templateId } });
        if (!template)
            throw new common_1.NotFoundException('Notification template not found');
        const content = data.variables
            ? Object.entries(data.variables).reduce((acc, [key, val]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), val), template.content)
            : template.content;
        const log = await this.prisma.notificationLog.create({
            data: {
                templateId: data.templateId,
                recipient: data.recipient,
                channel: data.channel,
                subject: template.subject,
                content,
                status: 'SENT',
                sentAt: new Date(),
                tenantId: template.tenantId,
            },
        });
        return { logId: log.id, channel: data.channel, recipient: data.recipient, status: 'SENT' };
    }
    async listLogs(tenantId, page = 1, limit = 20, search, sort) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { recipient: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.notificationLog.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
            this.prisma.notificationLog.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async broadcast(data) {
        const template = await this.prisma.notificationTemplate.findUnique({ where: { id: data.templateId } });
        if (!template)
            throw new common_1.NotFoundException('Notification template not found');
        const members = await this.prisma.member.findMany({
            where: { tenantId: data.tenantId, status: 'ACTIVE' },
        });
        if (members.length === 0) {
            return { sent: 0, total: 0, message: 'No active members found for this tenant' };
        }
        const logs = members.map((member) => {
            const content = data.variables
                ? Object.entries(data.variables).reduce((acc, [key, val]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), val), template.content)
                : template.content;
            return {
                templateId: data.templateId,
                recipient: member.email,
                channel: data.channel,
                subject: template.subject,
                content,
                status: 'SENT',
                sentAt: new Date(),
                tenantId: data.tenantId,
            };
        });
        await this.prisma.notificationLog.createMany({ data: logs });
        return { sent: logs.length, total: members.length, message: `Notification sent to ${logs.length} members` };
    }
    async findLogOne(id) {
        const log = await this.prisma.notificationLog.findUnique({
            where: { id },
        });
        if (!log)
            throw new common_1.NotFoundException('Notification log not found');
        return log;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], NotificationService);


/***/ }),
/* 102 */
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
const prisma_module_1 = __webpack_require__(15);
const audit_log_service_1 = __webpack_require__(103);
const audit_log_controller_1 = __webpack_require__(104);
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
/* 103 */
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
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let AuditLogService = class AuditLogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(params) {
        return this.prisma.auditLog.create({ data: params });
    }
    async findOne(id) {
        const log = await this.prisma.auditLog.findUnique({ where: { id } });
        if (!log)
            throw new common_1.NotFoundException('Audit log not found');
        return log;
    }
    async findAll(page = 1, limit = 20, search, entityType, action, userId, sort) {
        const skip = (page - 1) * limit;
        const where = {};
        if (entityType)
            where.entityType = entityType;
        if (action)
            where.action = action;
        if (userId)
            where.userId = userId;
        if (search) {
            where.OR = [
                { entityType: { contains: search, mode: 'insensitive' } },
                { userEmail: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const [data, total] = await Promise.all([
            this.prisma.auditLog.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
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
/* 104 */
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
const audit_log_service_1 = __webpack_require__(103);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let AuditLogController = class AuditLogController {
    auditLogService;
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    findOne(id) {
        return this.auditLogService.findOne(id);
    }
    findAll(page, limit, search, entityType, action, userId, sort) {
        return this.auditLogService.findAll(page, limit, search, entityType, action, userId, sort);
    }
};
exports.AuditLogController = AuditLogController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit log by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuditLogController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'List audit logs (paginated & filterable)' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('entityType')),
    __param(4, (0, common_1.Query)('action')),
    __param(5, (0, common_1.Query)('userId')),
    __param(6, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
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
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExportModule = void 0;
const common_1 = __webpack_require__(2);
const export_controller_1 = __webpack_require__(106);
const export_service_1 = __webpack_require__(107);
let ExportModule = class ExportModule {
};
exports.ExportModule = ExportModule;
exports.ExportModule = ExportModule = __decorate([
    (0, common_1.Module)({
        controllers: [export_controller_1.ExportController],
        providers: [export_service_1.ExportService],
        exports: [export_service_1.ExportService],
    })
], ExportModule);


/***/ }),
/* 106 */
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
exports.ExportController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const export_service_1 = __webpack_require__(107);
const prisma_service_1 = __webpack_require__(16);
const entityConfig = {
    tenants: {
        model: 'tenant',
        columns: [
            { key: 'name', label: 'Name' },
            { key: 'domain', label: 'Domain' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'status', label: 'Status' },
            { key: 'createdAt', label: 'Created At' },
        ],
    },
    members: {
        model: 'member',
        columns: [
            { key: 'fullName', label: 'Full Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'status', label: 'Status' },
            { key: 'availablePoints', label: 'Available Points' },
            { key: 'totalPoints', label: 'Total Points' },
            { key: 'createdAt', label: 'Created At' },
        ],
    },
    campaigns: {
        model: 'campaign',
        columns: [
            { key: 'name', label: 'Name' },
            { key: 'status', label: 'Status' },
            { key: 'startDate', label: 'Start Date' },
            { key: 'endDate', label: 'End Date' },
            { key: 'budget', label: 'Budget' },
        ],
    },
    rewards: {
        model: 'reward',
        columns: [
            { key: 'name', label: 'Name' },
            { key: 'type', label: 'Type' },
            { key: 'pointsRequired', label: 'Points Required' },
            { key: 'quantity', label: 'Quantity' },
        ],
    },
    vouchers: {
        model: 'voucher',
        columns: [
            { key: 'code', label: 'Code' },
            { key: 'type', label: 'Type' },
            { key: 'value', label: 'Value' },
            { key: 'usedCount', label: 'Used Count' },
            { key: 'maxUsage', label: 'Max Usage' },
            { key: 'expiresAt', label: 'Expires At' },
        ],
    },
    point_transactions: {
        model: 'pointTransaction',
        columns: [
            { key: 'memberId', label: 'Member ID' },
            { key: 'type', label: 'Type' },
            { key: 'amount', label: 'Amount' },
            { key: 'balance', label: 'Balance' },
            { key: 'reason', label: 'Reason' },
            { key: 'createdAt', label: 'Created At' },
        ],
    },
    referrals: {
        model: 'referral',
        columns: [
            { key: 'code', label: 'Code' },
            { key: 'status', label: 'Status' },
            { key: 'rewardGiven', label: 'Reward Given' },
            { key: 'createdAt', label: 'Created At' },
        ],
    },
    coupons: {
        model: 'coupon',
        columns: [
            { key: 'code', label: 'Code' },
            { key: 'type', label: 'Type' },
            { key: 'value', label: 'Value' },
            { key: 'usedCount', label: 'Used Count' },
            { key: 'maxUsage', label: 'Max Usage' },
            { key: 'status', label: 'Status' },
            { key: 'startDate', label: 'Start Date' },
            { key: 'endDate', label: 'End Date' },
            { key: 'createdAt', label: 'Created At' },
        ],
    },
    coupon_usages: {
        model: 'couponUsage',
        columns: [
            { key: 'couponId', label: 'Coupon ID' },
            { key: 'memberId', label: 'Member ID' },
            { key: 'orderId', label: 'Order ID' },
            { key: 'discountAmount', label: 'Discount Amount' },
            { key: 'createdAt', label: 'Used At' },
        ],
    },
};
let ExportController = class ExportController {
    exportService;
    prisma;
    constructor(exportService, prisma) {
        this.exportService = exportService;
        this.prisma = prisma;
    }
    async exportCsv(res, entity, tenantId) {
        const config = entityConfig[entity];
        if (!config) {
            throw new common_1.NotFoundException(`Unknown entity: ${entity}`);
        }
        const prismaModel = this.prisma[config.model];
        const where = tenantId ? { tenantId } : {};
        const data = await prismaModel.findMany({ where, orderBy: { createdAt: 'desc' } });
        const csv = this.exportService.toCsv(data, config.columns);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${entity}_${Date.now()}.csv"`);
        return res.send(csv);
    }
};
exports.ExportController = ExportController;
__decorate([
    (0, common_1.Get)(':entity'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Export data as CSV' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('entity')),
    __param(2, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportCsv", null);
exports.ExportController = ExportController = __decorate([
    (0, swagger_1.ApiTags)('Export'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('export'),
    __metadata("design:paramtypes", [typeof (_a = typeof export_service_1.ExportService !== "undefined" && export_service_1.ExportService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], ExportController);


/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExportService = void 0;
const common_1 = __webpack_require__(2);
let ExportService = class ExportService {
    toCsv(data, columns) {
        const header = columns.map(c => c.label).join(',');
        const rows = data.map(item => columns.map(col => {
            const val = String(item[col.key] ?? '');
            return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(','));
        return [header, ...rows].join('\n');
    }
    toJson(data) {
        return JSON.stringify(data, null, 2);
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)()
], ExportService);


/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImportModule = void 0;
const common_1 = __webpack_require__(2);
const import_controller_1 = __webpack_require__(109);
const import_service_1 = __webpack_require__(110);
let ImportModule = class ImportModule {
};
exports.ImportModule = ImportModule;
exports.ImportModule = ImportModule = __decorate([
    (0, common_1.Module)({
        controllers: [import_controller_1.ImportController],
        providers: [import_service_1.ImportService],
        exports: [import_service_1.ImportService],
    })
], ImportModule);


/***/ }),
/* 109 */
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
exports.ImportController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const import_service_1 = __webpack_require__(110);
let ImportController = class ImportController {
    importService;
    constructor(importService) {
        this.importService = importService;
    }
    importCsv(entity, body) {
        return this.importService.importCsv(entity, body.csv, body.tenantId);
    }
    importExcel(entity, body) {
        return this.importService.importExcel(entity, body.file, body.tenantId);
    }
};
exports.ImportController = ImportController;
__decorate([
    (0, common_1.Post)(':entity'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Import data from CSV' }),
    __param(0, (0, common_1.Param)('entity')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ImportController.prototype, "importCsv", null);
__decorate([
    (0, common_1.Post)(':entity/excel'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Import data from Excel (.xlsx) - send base64 content' }),
    __param(0, (0, common_1.Param)('entity')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ImportController.prototype, "importExcel", null);
exports.ImportController = ImportController = __decorate([
    (0, swagger_1.ApiTags)('Import'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('import'),
    __metadata("design:paramtypes", [typeof (_a = typeof import_service_1.ImportService !== "undefined" && import_service_1.ImportService) === "function" ? _a : Object])
], ImportController);


/***/ }),
/* 110 */
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
exports.ImportService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const XLSX = __importStar(__webpack_require__(111));
const entityConfigs = {
    tenants: {
        requiredFields: ['name', 'domain', 'email'],
        optionalFields: ['phone', 'address', 'status'],
        transform: (row) => ({
            name: row.name,
            domain: row.domain,
            email: row.email,
            phone: row.phone || undefined,
            address: row.address || undefined,
            status: (row.status || 'ACTIVE').toUpperCase(),
            hostId: row.hostId || undefined,
        }),
    },
    members: {
        requiredFields: ['fullName', 'email'],
        optionalFields: ['phone', 'status', 'availablePoints', 'tierId'],
        transform: (row) => ({
            fullName: row.fullName,
            email: row.email,
            phone: row.phone || undefined,
            status: (row.status || 'ACTIVE').toUpperCase(),
            availablePoints: row.availablePoints ? parseInt(row.availablePoints, 10) : 0,
            totalPoints: row.availablePoints ? parseInt(row.availablePoints, 10) : 0,
            tierId: row.tierId || undefined,
            tenantId: row.tenantId || undefined,
        }),
    },
    campaigns: {
        requiredFields: ['name', 'startDate', 'endDate'],
        optionalFields: ['description', 'budget', 'status'],
        transform: (row) => ({
            name: row.name,
            description: row.description || undefined,
            startDate: new Date(row.startDate),
            endDate: new Date(row.endDate),
            budget: row.budget ? parseFloat(row.budget) : undefined,
            status: (row.status || 'DRAFT').toUpperCase(),
            tenantId: row.tenantId || undefined,
        }),
    },
    rewards: {
        requiredFields: ['name', 'type', 'pointsRequired'],
        optionalFields: ['description', 'quantity', 'imageUrl'],
        transform: (row) => ({
            name: row.name,
            type: row.type,
            description: row.description || undefined,
            pointsRequired: parseInt(row.pointsRequired, 10),
            quantity: row.quantity ? parseInt(row.quantity, 10) : 0,
            imageUrl: row.imageUrl || undefined,
            tenantId: row.tenantId || undefined,
        }),
    },
    vouchers: {
        requiredFields: ['code', 'type', 'value'],
        optionalFields: ['maxUsage', 'expiresAt'],
        transform: (row) => ({
            code: row.code,
            type: row.type,
            value: parseFloat(row.value),
            maxUsage: row.maxUsage ? parseInt(row.maxUsage, 10) : undefined,
            expiresAt: row.expiresAt ? new Date(row.expiresAt) : undefined,
            tenantId: row.tenantId || undefined,
        }),
    },
    users: {
        requiredFields: ['email', 'fullName'],
        optionalFields: ['phone', 'role'],
        transform: (row) => ({
            email: row.email,
            fullName: row.fullName,
            phone: row.phone || undefined,
            role: (row.role || 'MEMBER').toUpperCase(),
            tenantId: row.tenantId || undefined,
        }),
    },
    tiers: {
        requiredFields: ['name', 'minPoints', 'maxPoints'],
        optionalFields: ['benefits', 'color', 'status'],
        transform: (row) => ({
            name: row.name,
            minPoints: parseInt(row.minPoints, 10),
            maxPoints: parseInt(row.maxPoints, 10),
            benefits: row.benefits || undefined,
            color: row.color || undefined,
            status: (row.status || 'ACTIVE').toUpperCase(),
            tenantId: row.tenantId || undefined,
        }),
    },
    promotions: {
        requiredFields: ['name'],
        optionalFields: ['description', 'priority', 'conditions', 'actions', 'status'],
        transform: (row) => ({
            name: row.name,
            description: row.description || undefined,
            priority: row.priority ? parseInt(row.priority, 10) : 0,
            conditions: row.conditions ? JSON.parse(row.conditions) : undefined,
            actions: row.actions ? JSON.parse(row.actions) : undefined,
            status: (row.status || 'ACTIVE').toUpperCase(),
            tenantId: row.tenantId || undefined,
        }),
    },
    badges: {
        requiredFields: ['name'],
        optionalFields: ['description', 'iconUrl', 'criteria'],
        transform: (row) => ({
            name: row.name,
            description: row.description || undefined,
            iconUrl: row.iconUrl || undefined,
            criteria: row.criteria ? JSON.parse(row.criteria) : undefined,
            tenantId: row.tenantId || undefined,
        }),
    },
    missions: {
        requiredFields: ['name', 'pointsReward'],
        optionalFields: ['description', 'criteria', 'startDate', 'endDate'],
        transform: (row) => ({
            name: row.name,
            description: row.description || undefined,
            pointsReward: parseInt(row.pointsReward, 10),
            criteria: row.criteria ? JSON.parse(row.criteria) : undefined,
            startDate: row.startDate ? new Date(row.startDate) : undefined,
            endDate: row.endDate ? new Date(row.endDate) : undefined,
            tenantId: row.tenantId || undefined,
        }),
    },
    referrals: {
        requiredFields: ['referrerId'],
        optionalFields: ['code', 'status', 'refereeId'],
        transform: (row) => ({
            referrerId: row.referrerId,
            code: row.code || undefined,
            status: (row.status || 'PENDING').toUpperCase(),
            refereeId: row.refereeId || undefined,
            tenantId: row.tenantId || undefined,
        }),
    },
    notification_templates: {
        requiredFields: ['name', 'type', 'subject', 'content'],
        optionalFields: ['variables'],
        transform: (row) => ({
            name: row.name,
            type: (row.type || 'EMAIL').toUpperCase(),
            subject: row.subject,
            content: row.content,
            variables: row.variables || undefined,
            tenantId: row.tenantId || undefined,
        }),
    },
    member_vouchers: {
        requiredFields: ['memberId', 'voucherId'],
        optionalFields: ['redeemed'],
        transform: (row) => ({
            memberId: row.memberId,
            voucherId: row.voucherId,
            redeemed: row.redeemed ? row.redeemed.toLowerCase() === 'true' : false,
            tenantId: row.tenantId || undefined,
        }),
    },
    point_transactions: {
        requiredFields: ['memberId', 'type', 'amount'],
        optionalFields: ['reason', 'reference', 'balance'],
        transform: (row) => ({
            memberId: row.memberId,
            type: (row.type || 'EARN').toUpperCase(),
            amount: parseInt(row.amount, 10),
            reason: row.reason || undefined,
            reference: row.reference || undefined,
            balance: row.balance ? parseInt(row.balance, 10) : undefined,
            tenantId: row.tenantId || undefined,
        }),
    },
    audit_logs: {
        requiredFields: ['entityType', 'entityId', 'action'],
        optionalFields: ['oldValue', 'newValue', 'ipAddress', 'userEmail', 'userId'],
        transform: (row) => ({
            entityType: row.entityType,
            entityId: row.entityId,
            action: (row.action || 'CREATE').toUpperCase(),
            oldValue: row.oldValue ? row.oldValue : undefined,
            newValue: row.newValue ? row.newValue : undefined,
            ipAddress: row.ipAddress || undefined,
            userEmail: row.userEmail || undefined,
            userId: row.userId || undefined,
            tenantId: row.tenantId || undefined,
        }),
    },
    products: {
        requiredFields: ['name', 'slug', 'price'],
        optionalFields: ['description', 'compareAtPrice', 'costPrice', 'imageUrl', 'unit', 'stock', 'sku', 'barcode', 'status', 'categoryId'],
        transform: (row) => ({
            name: row.name,
            slug: row.slug,
            description: row.description || undefined,
            price: parseFloat(row.price),
            compareAtPrice: row.compareAtPrice ? parseFloat(row.compareAtPrice) : undefined,
            costPrice: row.costPrice ? parseFloat(row.costPrice) : undefined,
            imageUrl: row.imageUrl || undefined,
            unit: row.unit || 'piece',
            stock: row.stock ? parseInt(row.stock, 10) : 0,
            sku: row.sku || undefined,
            barcode: row.barcode || undefined,
            status: (row.status || 'ACTIVE').toUpperCase(),
            categoryId: row.categoryId || undefined,
            tenantId: row.tenantId || undefined,
        }),
    },
    product_categories: {
        requiredFields: ['name', 'slug'],
        optionalFields: ['description', 'icon', 'sortOrder'],
        transform: (row) => ({
            name: row.name,
            slug: row.slug,
            description: row.description || undefined,
            icon: row.icon || undefined,
            sortOrder: row.sortOrder ? parseInt(row.sortOrder, 10) : 0,
            tenantId: row.tenantId || undefined,
        }),
    },
    coupons: {
        requiredFields: ['code', 'type', 'value'],
        optionalFields: ['minAmount', 'maxDiscount', 'maxUsage', 'maxUsagePerMember', 'description', 'startDate', 'endDate', 'status'],
        transform: (row) => ({
            code: row.code,
            type: (row.type || 'PERCENTAGE').toUpperCase(),
            value: parseFloat(row.value),
            minAmount: row.minAmount ? parseFloat(row.minAmount) : undefined,
            maxDiscount: row.maxDiscount ? parseFloat(row.maxDiscount) : undefined,
            maxUsage: row.maxUsage ? parseInt(row.maxUsage, 10) : undefined,
            maxUsagePerMember: row.maxUsagePerMember ? parseInt(row.maxUsagePerMember, 10) : undefined,
            description: row.description || undefined,
            startDate: row.startDate ? new Date(row.startDate) : undefined,
            endDate: row.endDate ? new Date(row.endDate) : undefined,
            status: (row.status || 'ACTIVE').toUpperCase(),
            tenantId: row.tenantId || undefined,
        }),
    },
};
let ImportService = class ImportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async importCsv(entity, csvContent, tenantId) {
        const rows = this.parseCsvToRows(csvContent);
        return this.importRows(entity, rows, tenantId);
    }
    async importExcel(entity, base64Content, tenantId) {
        const workbook = XLSX.read(base64Content, { type: 'base64' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName)
            throw new common_1.BadRequestException('Excel file has no sheets');
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        if (jsonData.length === 0)
            throw new common_1.BadRequestException('Excel file has no data rows');
        const headers = Object.keys(jsonData[0]);
        const rows = jsonData.map(row => headers.map(h => row[h]?.toString() || ''));
        return this.importRows(entity, { headers, rows }, tenantId);
    }
    async importRows(entity, parsed, tenantId) {
        const config = entityConfigs[entity];
        if (!config)
            throw new common_1.BadRequestException(`Unsupported entity: ${entity}`);
        const missing = config.requiredFields.filter(f => !parsed.headers.includes(f));
        if (missing.length > 0) {
            throw new common_1.BadRequestException(`Missing required columns: ${missing.join(', ')}`);
        }
        const errors = [];
        const created = [];
        const prismaModel = this.prisma[entity === 'members' ? 'member' :
            entity === 'tenants' ? 'tenant' :
                entity === 'rewards' ? 'reward' :
                    entity === 'vouchers' ? 'voucher' :
                        entity === 'tiers' ? 'tier' :
                            entity === 'promotions' ? 'promotion' :
                                entity === 'badges' ? 'badge' :
                                    entity === 'missions' ? 'mission' :
                                        entity === 'users' ? 'user' :
                                            entity === 'referrals' ? 'referral' :
                                                entity === 'notification_templates' ? 'notificationTemplate' :
                                                    entity === 'member_vouchers' ? 'memberVoucher' :
                                                        entity === 'point_transactions' ? 'pointTransaction' :
                                                            entity === 'audit_logs' ? 'auditLog' :
                                                                entity === 'products' ? 'product' :
                                                                    entity === 'product_categories' ? 'productCategory' :
                                                                        entity === 'coupons' ? 'coupon' : entity];
        for (let i = 0; i < parsed.rows.length; i++) {
            try {
                const values = parsed.rows[i];
                if (values.length === 0 || values.every(v => !v.trim()))
                    continue;
                const row = {};
                parsed.headers.forEach((h, idx) => { row[h] = (values[idx] || '').trim(); });
                const rowMissingFields = config.requiredFields.filter(f => !row[f]);
                if (rowMissingFields.length > 0) {
                    errors.push({ row: i + 2, message: `Missing required fields: ${rowMissingFields.join(', ')}` });
                    continue;
                }
                const data = config.transform(row);
                if (tenantId)
                    data.tenantId = tenantId;
                const record = await prismaModel.create({ data });
                created.push(record);
            }
            catch (err) {
                errors.push({ row: i + 2, message: err.message || 'Unknown error' });
            }
        }
        return { total: parsed.rows.length, created: created.length, errors };
    }
    parseCsvToRows(csvContent) {
        const lines = csvContent.trim().split('\n');
        if (lines.length < 2)
            throw new common_1.BadRequestException('CSV must have a header row and at least one data row');
        const headers = this.parseCsvRow(lines[0]);
        const rows = lines.slice(1).map(line => this.parseCsvRow(line));
        return { headers, rows };
    }
    parseCsvRow(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                }
                else
                    inQuotes = !inQuotes;
            }
            else if (ch === ',' && !inQuotes) {
                result.push(current);
                current = '';
            }
            else {
                current += ch;
            }
        }
        result.push(current);
        return result;
    }
    getSupportedEntities() {
        return Object.keys(entityConfigs);
    }
};
exports.ImportService = ImportService;
exports.ImportService = ImportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ImportService);


/***/ }),
/* 111 */
/***/ ((module) => {

module.exports = require("xlsx");

/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BulkModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_module_1 = __webpack_require__(15);
const bulk_controller_1 = __webpack_require__(113);
const bulk_service_1 = __webpack_require__(114);
let BulkModule = class BulkModule {
};
exports.BulkModule = BulkModule;
exports.BulkModule = BulkModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [bulk_controller_1.BulkController],
        providers: [bulk_service_1.BulkService],
    })
], BulkModule);


/***/ }),
/* 113 */
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
exports.BulkController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const bulk_service_1 = __webpack_require__(114);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let BulkController = class BulkController {
    bulkService;
    constructor(bulkService) {
        this.bulkService = bulkService;
    }
    bulkDelete(body) {
        return this.bulkService.bulkDelete(body.entity, body.ids, body.tenantId);
    }
    bulkUpdateStatus(body) {
        return this.bulkService.bulkUpdateStatus(body.entity, body.ids, body.status, body.tenantId);
    }
};
exports.BulkController = BulkController;
__decorate([
    (0, common_1.Post)('delete'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk delete records by IDs' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BulkController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Post)('update-status'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update status for records by IDs' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BulkController.prototype, "bulkUpdateStatus", null);
exports.BulkController = BulkController = __decorate([
    (0, swagger_1.ApiTags)('Bulk Operations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('bulk'),
    __metadata("design:paramtypes", [typeof (_a = typeof bulk_service_1.BulkService !== "undefined" && bulk_service_1.BulkService) === "function" ? _a : Object])
], BulkController);


/***/ }),
/* 114 */
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
exports.BulkService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const ENTITY_MAP = {
    tenants: 'tenant',
    members: 'member',
    users: 'user',
    tiers: 'tier',
    campaigns: 'campaign',
    rewards: 'reward',
    vouchers: 'voucher',
    promotions: 'promotion',
    referrals: 'referral',
    badges: 'badge',
    missions: 'mission',
    notificationTemplates: 'notificationTemplate',
    notificationLogs: 'notificationLog',
    memberVouchers: 'memberVoucher',
    pointTransactions: 'pointTransaction',
};
const SOFT_DELETE_ENTITIES = new Set(['tenant', 'member', 'user']);
let BulkService = class BulkService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async bulkDelete(entity, ids, tenantId) {
        const modelName = ENTITY_MAP[entity];
        if (!modelName)
            throw new common_1.BadRequestException(`Unsupported entity: ${entity}`);
        const model = this.prisma[modelName];
        if (!model)
            throw new common_1.BadRequestException(`Model not found: ${modelName}`);
        const where = { id: { in: ids } };
        if (tenantId)
            where.tenantId = tenantId;
        if (SOFT_DELETE_ENTITIES.has(modelName)) {
            const result = await model.updateMany({
                where,
                data: { status: modelName === 'tenant' ? 'DISABLED' : 'INACTIVE' },
            });
            return { deleted: result.count, total: ids.length, soft: true };
        }
        const result = await model.deleteMany({ where });
        return { deleted: result.count, total: ids.length, soft: false };
    }
    async bulkUpdateStatus(entity, ids, status, tenantId) {
        const modelName = ENTITY_MAP[entity];
        if (!modelName)
            throw new common_1.BadRequestException(`Unsupported entity: ${entity}`);
        const model = this.prisma[modelName];
        if (!model)
            throw new common_1.BadRequestException(`Model not found: ${modelName}`);
        const where = { id: { in: ids } };
        if (tenantId)
            where.tenantId = tenantId;
        const result = await model.updateMany({
            where,
            data: { status },
        });
        return { updated: result.count, total: ids.length };
    }
};
exports.BulkService = BulkService;
exports.BulkService = BulkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], BulkService);


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckinModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_module_1 = __webpack_require__(15);
const checkin_controller_1 = __webpack_require__(116);
const checkin_service_1 = __webpack_require__(117);
let CheckinModule = class CheckinModule {
};
exports.CheckinModule = CheckinModule;
exports.CheckinModule = CheckinModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [checkin_controller_1.CheckinController],
        providers: [checkin_service_1.CheckinService],
        exports: [checkin_service_1.CheckinService],
    })
], CheckinModule);


/***/ }),
/* 116 */
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
exports.CheckinController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const checkin_service_1 = __webpack_require__(117);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let CheckinController = class CheckinController {
    checkinService;
    constructor(checkinService) {
        this.checkinService = checkinService;
    }
    doCheckin(req) {
        return this.checkinService.doCheckin(req.user.id);
    }
    getStats(req) {
        return this.checkinService.getStats(req.user.id);
    }
    getHistory(req) {
        return this.checkinService.getHistory(req.user.id);
    }
    getAdminStats(req, tenantId) {
        return this.checkinService.getAdminStats(req.tenantId ?? tenantId);
    }
};
exports.CheckinController = CheckinController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Daily check-in (earn streak points)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CheckinController.prototype, "doCheckin", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get check-in stats (current streak, total)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CheckinController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get check-in history for this month' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CheckinController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: check-in analytics (streaks, trends)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CheckinController.prototype, "getAdminStats", null);
exports.CheckinController = CheckinController = __decorate([
    (0, swagger_1.ApiTags)('Daily Check-in'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('checkin'),
    __metadata("design:paramtypes", [typeof (_a = typeof checkin_service_1.CheckinService !== "undefined" && checkin_service_1.CheckinService) === "function" ? _a : Object])
], CheckinController);


/***/ }),
/* 117 */
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
exports.CheckinService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
let CheckinService = class CheckinService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async doCheckin(memberId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const alreadyCheckedIn = await this.prisma.dailyCheckin.findUnique({
            where: { memberId_date: { memberId, date: today } },
        });
        if (alreadyCheckedIn)
            throw new common_1.BadRequestException('Already checked in today');
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayCheckin = await this.prisma.dailyCheckin.findUnique({
            where: { memberId_date: { memberId, date: yesterday } },
        });
        const streak = yesterdayCheckin ? yesterdayCheckin.streak + 1 : 1;
        const pointsAwarded = Math.min(10 + (streak - 1) * 5, 100);
        const checkin = await this.prisma.dailyCheckin.create({
            data: { memberId, date: today, streak, pointsAwarded },
        });
        await this.prisma.$transaction([
            this.prisma.pointTransaction.create({
                data: {
                    memberId,
                    type: 'EARN',
                    amount: pointsAwarded,
                    balance: 0,
                    reason: `Daily check-in (streak: ${streak})`,
                },
            }),
            this.prisma.member.update({
                where: { id: memberId },
                data: {
                    totalPoints: { increment: pointsAwarded },
                    availablePoints: { increment: pointsAwarded },
                },
            }),
        ]);
        return checkin;
    }
    async getStats(memberId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalCheckins, latest, todayCheckin] = await Promise.all([
            this.prisma.dailyCheckin.count({ where: { memberId } }),
            this.prisma.dailyCheckin.findFirst({
                where: { memberId },
                orderBy: { date: 'desc' },
            }),
            this.prisma.dailyCheckin.findUnique({
                where: { memberId_date: { memberId, date: today } },
            }),
        ]);
        return {
            currentStreak: todayCheckin?.streak ?? 0,
            totalCheckins,
            longestStreak: latest?.streak ?? 0,
            checkedInToday: !!todayCheckin,
        };
    }
    async getHistory(memberId) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return this.prisma.dailyCheckin.findMany({
            where: { memberId, date: { gte: startOfMonth } },
            orderBy: { date: 'desc' },
        });
    }
    async getAdminStats(tenantId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const memberFilter = tenantId ? { member: { tenantId } } : {};
        const tenantFilter = tenantId ? { tenantId } : {};
        const [checkedInToday, totalThisMonth, streaks, recent] = await Promise.all([
            this.prisma.dailyCheckin.count({
                where: { date: today, ...memberFilter },
            }),
            this.prisma.dailyCheckin.count({
                where: { date: { gte: startOfMonth }, ...memberFilter },
            }),
            this.prisma.dailyCheckin.findMany({
                where: { ...memberFilter, streak: { gte: 7 } },
                include: { member: { select: { id: true, fullName: true, email: true } } },
                orderBy: { streak: 'desc' },
                take: 10,
            }),
            this.prisma.dailyCheckin.findMany({
                where: memberFilter,
                include: { member: { select: { id: true, fullName: true, email: true } } },
                orderBy: { date: 'desc' },
                take: 20,
            }),
        ]);
        return {
            checkedInToday,
            totalThisMonth,
            activeStreaks: streaks.length,
            topStreaks: streaks.map(s => ({
                memberId: s.memberId,
                fullName: s.member?.fullName,
                email: s.member?.email,
                streak: s.streak,
                lastCheckin: s.date,
            })),
            recentActivity: recent.map(r => ({
                id: r.id,
                memberId: r.memberId,
                fullName: r.member?.fullName,
                streak: r.streak,
                pointsAwarded: r.pointsAwarded,
                date: r.date,
            })),
        };
    }
};
exports.CheckinService = CheckinService;
exports.CheckinService = CheckinService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CheckinService);


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EarningRuleModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_module_1 = __webpack_require__(15);
const earning_rule_controller_1 = __webpack_require__(119);
const earning_rule_service_1 = __webpack_require__(120);
let EarningRuleModule = class EarningRuleModule {
};
exports.EarningRuleModule = EarningRuleModule;
exports.EarningRuleModule = EarningRuleModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [earning_rule_controller_1.EarningRuleController],
        providers: [earning_rule_service_1.EarningRuleService],
        exports: [earning_rule_service_1.EarningRuleService],
    })
], EarningRuleModule);


/***/ }),
/* 119 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EarningRuleController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const earning_rule_service_1 = __webpack_require__(120);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const earning_rule_dto_1 = __webpack_require__(121);
let EarningRuleController = class EarningRuleController {
    earningRuleService;
    constructor(earningRuleService) {
        this.earningRuleService = earningRuleService;
    }
    create(body) {
        return this.earningRuleService.create(body);
    }
    findAll(query) {
        return this.earningRuleService.findAll(query.tenantId, query.page, query.limit, query.search, query.category);
    }
    calculate(tenantId, amount, category) {
        return this.earningRuleService.calculateEarning(tenantId, Number(amount), category);
    }
    findOne(id) {
        return this.earningRuleService.findOne(id);
    }
    update(id, body) {
        return this.earningRuleService.update(id, body);
    }
    remove(id) {
        return this.earningRuleService.remove(id);
    }
};
exports.EarningRuleController = EarningRuleController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a point earning rule' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof earning_rule_dto_1.CreateEarningRuleDto !== "undefined" && earning_rule_dto_1.CreateEarningRuleDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], EarningRuleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List earning rules (paginated)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof earning_rule_dto_1.EarningRuleQueryDto !== "undefined" && earning_rule_dto_1.EarningRuleQueryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], EarningRuleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('calculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate points for a purchase amount' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('amount')),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", void 0)
], EarningRuleController.prototype, "calculate", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get earning rule by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EarningRuleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update earning rule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof earning_rule_dto_1.UpdateEarningRuleDto !== "undefined" && earning_rule_dto_1.UpdateEarningRuleDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], EarningRuleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete earning rule' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EarningRuleController.prototype, "remove", null);
exports.EarningRuleController = EarningRuleController = __decorate([
    (0, swagger_1.ApiTags)('Point Earning Rules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('earning-rules'),
    __metadata("design:paramtypes", [typeof (_a = typeof earning_rule_service_1.EarningRuleService !== "undefined" && earning_rule_service_1.EarningRuleService) === "function" ? _a : Object])
], EarningRuleController);


/***/ }),
/* 120 */
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
exports.EarningRuleService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
let EarningRuleService = class EarningRuleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.pointEarningRule.create({ data: data });
    }
    async findAll(tenantId, page = 1, limit = 20, search, category) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (category)
            where.category = category;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.pointEarningRule.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.pointEarningRule.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const rule = await this.prisma.pointEarningRule.findUnique({ where: { id } });
        if (!rule)
            throw new common_1.NotFoundException('Earning rule not found');
        return rule;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.pointEarningRule.update({ where: { id }, data: data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.pointEarningRule.delete({ where: { id } });
    }
    async calculateEarning(tenantId, amount, category) {
        const where = { tenantId, status: 'ACTIVE' };
        if (category)
            where.category = category;
        const rules = await this.prisma.pointEarningRule.findMany({ where, orderBy: { pointsPerUnit: 'desc' } });
        if (rules.length === 0)
            return { points: 0, rule: null, amount };
        const matched = rules.find(r => {
            if (r.minAmount && amount < r.minAmount)
                return false;
            if (r.maxAmount && amount > r.maxAmount)
                return false;
            return true;
        });
        if (!matched)
            return { points: 0, rule: null, amount };
        const points = Math.round(amount * matched.pointsPerUnit);
        return { points, rule: matched.name, amount };
    }
};
exports.EarningRuleService = EarningRuleService;
exports.EarningRuleService = EarningRuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], EarningRuleService);


/***/ }),
/* 121 */
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
exports.EarningRuleQueryDto = exports.UpdateEarningRuleDto = exports.CreateEarningRuleDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
const class_transformer_1 = __webpack_require__(76);
class CreateEarningRuleDto {
    name;
    description;
    pointsPerUnit;
    minAmount;
    maxAmount;
    category;
    tenantId;
}
exports.CreateEarningRuleDto = CreateEarningRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEarningRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEarningRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateEarningRuleDto.prototype, "pointsPerUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateEarningRuleDto.prototype, "minAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateEarningRuleDto.prototype, "maxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEarningRuleDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEarningRuleDto.prototype, "tenantId", void 0);
class UpdateEarningRuleDto {
    name;
    description;
    pointsPerUnit;
    minAmount;
    maxAmount;
    category;
    status;
}
exports.UpdateEarningRuleDto = UpdateEarningRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEarningRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEarningRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateEarningRuleDto.prototype, "pointsPerUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateEarningRuleDto.prototype, "minAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateEarningRuleDto.prototype, "maxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEarningRuleDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEarningRuleDto.prototype, "status", void 0);
class EarningRuleQueryDto {
    tenantId;
    page;
    limit;
    search;
    category;
}
exports.EarningRuleQueryDto = EarningRuleQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EarningRuleQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], EarningRuleQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], EarningRuleQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EarningRuleQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EarningRuleQueryDto.prototype, "category", void 0);


/***/ }),
/* 122 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoreModule = void 0;
const common_1 = __webpack_require__(2);
const store_service_1 = __webpack_require__(123);
const store_controller_1 = __webpack_require__(124);
let StoreModule = class StoreModule {
};
exports.StoreModule = StoreModule;
exports.StoreModule = StoreModule = __decorate([
    (0, common_1.Module)({
        controllers: [store_controller_1.StoreController],
        providers: [store_service_1.StoreService],
        exports: [store_service_1.StoreService],
    })
], StoreModule);


/***/ }),
/* 123 */
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
exports.StoreService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let StoreService = class StoreService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.store.findUnique({ where: { code: data.code } });
        if (existing)
            throw new common_1.BadRequestException('Store code already exists');
        return this.prisma.store.create({
            data: {
                name: data.name,
                code: data.code,
                address: data.address,
                phone: data.phone,
                email: data.email,
                latitude: data.latitude,
                longitude: data.longitude,
                openingHours: data.openingHours || null,
                tenantId: data.tenantId,
            },
        });
    }
    async findAll(tenantId, page = 1, limit = 20, search, status, sort) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.store.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
            this.prisma.store.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const store = await this.prisma.store.findUnique({ where: { id }, include: { storeStaff: true } });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        return store;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.store.update({ where: { id }, data: data });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.storeStaff.deleteMany({ where: { storeId: id } });
        return this.prisma.store.delete({ where: { id } });
    }
    async addStaff(storeId, data) {
        await this.findOne(storeId);
        return this.prisma.storeStaff.create({ data: { ...data, storeId } });
    }
    async listStaff(storeId) {
        await this.findOne(storeId);
        return this.prisma.storeStaff.findMany({ where: { storeId } });
    }
    async updateStaff(staffId, data) {
        const staff = await this.prisma.storeStaff.findUnique({ where: { id: staffId } });
        if (!staff)
            throw new common_1.NotFoundException('Staff not found');
        return this.prisma.storeStaff.update({ where: { id: staffId }, data });
    }
    async removeStaff(staffId) {
        const staff = await this.prisma.storeStaff.findUnique({ where: { id: staffId } });
        if (!staff)
            throw new common_1.NotFoundException('Staff not found');
        return this.prisma.storeStaff.delete({ where: { id: staffId } });
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], StoreService);


/***/ }),
/* 124 */
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
exports.StoreController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const store_service_1 = __webpack_require__(123);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let StoreController = class StoreController {
    storeService;
    constructor(storeService) {
        this.storeService = storeService;
    }
    create(body) {
        return this.storeService.create(body);
    }
    findAll(query) {
        return this.storeService.findAll(query.tenantId, query.page, query.limit, query.search, query.status, query.sort);
    }
    findOne(id) {
        return this.storeService.findOne(id);
    }
    update(id, body) {
        return this.storeService.update(id, body);
    }
    remove(id) {
        return this.storeService.remove(id);
    }
    addStaff(id, body) {
        return this.storeService.addStaff(id, body);
    }
    listStaff(id) {
        return this.storeService.listStaff(id);
    }
    updateStaff(staffId, body) {
        return this.storeService.updateStaff(staffId, body);
    }
    removeStaff(staffId) {
        return this.storeService.removeStaff(staffId);
    }
};
exports.StoreController = StoreController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a store/outlet' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List stores' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get store by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update store' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete store' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/staff'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Add staff to store' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "addStaff", null);
__decorate([
    (0, common_1.Get)(':id/staff'),
    (0, swagger_1.ApiOperation)({ summary: 'List store staff' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "listStaff", null);
__decorate([
    (0, common_1.Put)('staff/:staffId'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update store staff' }),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "updateStaff", null);
__decorate([
    (0, common_1.Delete)('staff/:staffId'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove store staff' }),
    __param(0, (0, common_1.Param)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "removeStaff", null);
exports.StoreController = StoreController = __decorate([
    (0, swagger_1.ApiTags)('Stores'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('stores'),
    __metadata("design:paramtypes", [typeof (_a = typeof store_service_1.StoreService !== "undefined" && store_service_1.StoreService) === "function" ? _a : Object])
], StoreController);


/***/ }),
/* 125 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CashbackModule = void 0;
const common_1 = __webpack_require__(2);
const cashback_service_1 = __webpack_require__(126);
const cashback_controller_1 = __webpack_require__(127);
let CashbackModule = class CashbackModule {
};
exports.CashbackModule = CashbackModule;
exports.CashbackModule = CashbackModule = __decorate([
    (0, common_1.Module)({
        controllers: [cashback_controller_1.CashbackController],
        providers: [cashback_service_1.CashbackService],
        exports: [cashback_service_1.CashbackService],
    })
], CashbackModule);


/***/ }),
/* 126 */
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
exports.CashbackService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
let CashbackService = class CashbackService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createConfig(data) {
        return this.prisma.cashbackConfig.create({
            data: {
                ...data,
                rate: data.rate || 0.01,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
        });
    }
    async listConfigs(tenantId, page = 1, limit = 20) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.cashbackConfig.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.cashbackConfig.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getConfig(id) {
        const config = await this.prisma.cashbackConfig.findUnique({ where: { id } });
        if (!config)
            throw new common_1.NotFoundException('Cashback config not found');
        return config;
    }
    async updateConfig(id, data) {
        await this.getConfig(id);
        return this.prisma.cashbackConfig.update({ where: { id }, data });
    }
    async deleteConfig(id) {
        await this.getConfig(id);
        return this.prisma.cashbackConfig.delete({ where: { id } });
    }
    async getBalance(memberId) {
        const aggregations = await this.prisma.cashbackTransaction.aggregate({
            where: { memberId },
            _sum: { amount: true },
        });
        return { balance: aggregations._sum.amount || 0 };
    }
    async earn(memberId, amount, description, referenceId) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const currentBalance = (await this.getBalance(memberId)).balance;
        const newBalance = currentBalance + amount;
        return this.prisma.cashbackTransaction.create({
            data: {
                memberId,
                type: 'EARN',
                amount,
                balance: newBalance,
                description: description || 'Cashback earned',
                referenceId,
                tenantId: member.tenantId,
            },
        });
    }
    async redeem(memberId, amount, description) {
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const currentBalance = (await this.getBalance(memberId)).balance;
        if (currentBalance < amount)
            throw new common_1.BadRequestException('Insufficient cashback balance');
        const newBalance = currentBalance - amount;
        return this.prisma.cashbackTransaction.create({
            data: {
                memberId,
                type: 'REDEEM',
                amount: -Math.abs(amount),
                balance: newBalance,
                description: description || 'Cashback redeemed',
                tenantId: member.tenantId,
            },
        });
    }
    async getTransactions(memberId, page = 1, limit = 20, type) {
        const where = { memberId };
        if (type)
            where.type = type;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.cashbackTransaction.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.cashbackTransaction.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
};
exports.CashbackService = CashbackService;
exports.CashbackService = CashbackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CashbackService);


/***/ }),
/* 127 */
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
exports.CashbackController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const cashback_service_1 = __webpack_require__(126);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let CashbackController = class CashbackController {
    cashbackService;
    constructor(cashbackService) {
        this.cashbackService = cashbackService;
    }
    createConfig(body) {
        return this.cashbackService.createConfig(body);
    }
    listConfigs(query) {
        return this.cashbackService.listConfigs(query.tenantId, query.page, query.limit);
    }
    getConfig(id) {
        return this.cashbackService.getConfig(id);
    }
    updateConfig(id, body) {
        return this.cashbackService.updateConfig(id, body);
    }
    deleteConfig(id) {
        return this.cashbackService.deleteConfig(id);
    }
    earn(body) {
        return this.cashbackService.earn(body.memberId, body.amount, body.description, body.referenceId);
    }
    redeem(body) {
        return this.cashbackService.redeem(body.memberId, body.amount, body.description);
    }
    getBalance(memberId) {
        return this.cashbackService.getBalance(memberId);
    }
    getTransactions(memberId, query) {
        return this.cashbackService.getTransactions(memberId, query.page, query.limit, query.type);
    }
};
exports.CashbackController = CashbackController;
__decorate([
    (0, common_1.Post)('configs'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create cashback config' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CashbackController.prototype, "createConfig", null);
__decorate([
    (0, common_1.Get)('configs'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'List cashback configs' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CashbackController.prototype, "listConfigs", null);
__decorate([
    (0, common_1.Get)('configs/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cashback config' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CashbackController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Put)('configs/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cashback config' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CashbackController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Delete)('configs/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete cashback config' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CashbackController.prototype, "deleteConfig", null);
__decorate([
    (0, common_1.Post)('earn'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Earn cashback for member' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CashbackController.prototype, "earn", null);
__decorate([
    (0, common_1.Post)('redeem'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem cashback for member' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CashbackController.prototype, "redeem", null);
__decorate([
    (0, common_1.Get)('balance/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member cashback balance' }),
    __param(0, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CashbackController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('transactions/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member cashback transactions' }),
    __param(0, (0, common_1.Param)('memberId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CashbackController.prototype, "getTransactions", null);
exports.CashbackController = CashbackController = __decorate([
    (0, swagger_1.ApiTags)('Cashback'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cashback'),
    __metadata("design:paramtypes", [typeof (_a = typeof cashback_service_1.CashbackService !== "undefined" && cashback_service_1.CashbackService) === "function" ? _a : Object])
], CashbackController);


/***/ }),
/* 128 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PartnershipModule = void 0;
const common_1 = __webpack_require__(2);
const partnership_service_1 = __webpack_require__(129);
const partnership_controller_1 = __webpack_require__(130);
let PartnershipModule = class PartnershipModule {
};
exports.PartnershipModule = PartnershipModule;
exports.PartnershipModule = PartnershipModule = __decorate([
    (0, common_1.Module)({
        controllers: [partnership_controller_1.PartnershipController],
        providers: [partnership_service_1.PartnershipService],
        exports: [partnership_service_1.PartnershipService],
    })
], PartnershipModule);


/***/ }),
/* 129 */
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
exports.PartnershipService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let PartnershipService = class PartnershipService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBrand(data) {
        const existing = await this.prisma.partnerBrand.findUnique({ where: { code: data.code } });
        if (existing)
            throw new common_1.BadRequestException('Brand code already exists');
        return this.prisma.partnerBrand.create({
            data: { ...data, commissionRate: data.commissionRate || 0.05 },
        });
    }
    async listBrands(tenantId, page = 1, limit = 20, search, status, sort) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.partnerBrand.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
            this.prisma.partnerBrand.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getBrand(id) {
        const brand = await this.prisma.partnerBrand.findUnique({ where: { id }, include: { partnerRewards: true } });
        if (!brand)
            throw new common_1.NotFoundException('Partner brand not found');
        return brand;
    }
    async updateBrand(id, data) {
        await this.getBrand(id);
        return this.prisma.partnerBrand.update({ where: { id }, data });
    }
    async deleteBrand(id) {
        await this.getBrand(id);
        await this.prisma.partnerReward.deleteMany({ where: { brandId: id } });
        return this.prisma.partnerBrand.delete({ where: { id } });
    }
    async createReward(brandId, data) {
        await this.getBrand(brandId);
        return this.prisma.partnerReward.create({
            data: {
                ...data,
                quantity: data.quantity || 0,
                brandId,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
        });
    }
    async listRewards(brandId, page = 1, limit = 20) {
        const where = { brandId };
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.partnerReward.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.partnerReward.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async updateReward(id, data) {
        const reward = await this.prisma.partnerReward.findUnique({ where: { id } });
        if (!reward)
            throw new common_1.NotFoundException('Partner reward not found');
        return this.prisma.partnerReward.update({ where: { id }, data });
    }
    async deleteReward(id) {
        const reward = await this.prisma.partnerReward.findUnique({ where: { id } });
        if (!reward)
            throw new common_1.NotFoundException('Partner reward not found');
        return this.prisma.partnerReward.delete({ where: { id } });
    }
    async redeemReward(memberId, rewardId, quantity = 1) {
        const reward = await this.prisma.partnerReward.findUnique({ where: { id: rewardId } });
        if (!reward)
            throw new common_1.NotFoundException('Partner reward not found');
        if (reward.quantity < quantity)
            throw new common_1.BadRequestException('Not enough stock');
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (member.availablePoints < reward.pointsRequired * quantity) {
            throw new common_1.BadRequestException('Insufficient points');
        }
        const totalPoints = reward.pointsRequired * quantity;
        await this.prisma.$transaction(async (tx) => {
            await tx.partnerReward.update({ where: { id: rewardId }, data: { quantity: { decrement: quantity } } });
            await tx.member.update({ where: { id: memberId }, data: { availablePoints: { decrement: totalPoints }, totalPoints: { decrement: totalPoints } } });
            await tx.pointTransaction.create({
                data: {
                    memberId,
                    type: 'BURN',
                    amount: -totalPoints,
                    balance: member.availablePoints - totalPoints,
                    reason: `Redeemed partner reward: ${reward.name}`,
                    reference: rewardId,
                },
            });
        });
        return { message: 'Partner reward redeemed successfully', reward: reward.name, pointsSpent: totalPoints };
    }
};
exports.PartnershipService = PartnershipService;
exports.PartnershipService = PartnershipService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PartnershipService);


/***/ }),
/* 130 */
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
exports.PartnershipController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const partnership_service_1 = __webpack_require__(129);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let PartnershipController = class PartnershipController {
    partnershipService;
    constructor(partnershipService) {
        this.partnershipService = partnershipService;
    }
    createBrand(body) {
        return this.partnershipService.createBrand(body);
    }
    listBrands(query) {
        return this.partnershipService.listBrands(query.tenantId, query.page, query.limit, query.search, query.status, query.sort);
    }
    getBrand(id) {
        return this.partnershipService.getBrand(id);
    }
    updateBrand(id, body) {
        return this.partnershipService.updateBrand(id, body);
    }
    deleteBrand(id) {
        return this.partnershipService.deleteBrand(id);
    }
    createReward(brandId, body) {
        return this.partnershipService.createReward(brandId, body);
    }
    listRewards(brandId, query) {
        return this.partnershipService.listRewards(brandId, query.page, query.limit);
    }
    updateReward(id, body) {
        return this.partnershipService.updateReward(id, body);
    }
    deleteReward(id) {
        return this.partnershipService.deleteReward(id);
    }
    redeemReward(body) {
        return this.partnershipService.redeemReward(body.memberId, body.rewardId, body.quantity);
    }
};
exports.PartnershipController = PartnershipController;
__decorate([
    (0, common_1.Post)('brands'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create partner brand' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnershipController.prototype, "createBrand", null);
__decorate([
    (0, common_1.Get)('brands'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'List partner brands' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnershipController.prototype, "listBrands", null);
__decorate([
    (0, common_1.Get)('brands/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Get partner brand' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnershipController.prototype, "getBrand", null);
__decorate([
    (0, common_1.Put)('brands/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update partner brand' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PartnershipController.prototype, "updateBrand", null);
__decorate([
    (0, common_1.Delete)('brands/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete partner brand' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnershipController.prototype, "deleteBrand", null);
__decorate([
    (0, common_1.Post)('brands/:brandId/rewards'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create partner reward' }),
    __param(0, (0, common_1.Param)('brandId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PartnershipController.prototype, "createReward", null);
__decorate([
    (0, common_1.Get)('brands/:brandId/rewards'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'List partner rewards' }),
    __param(0, (0, common_1.Param)('brandId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PartnershipController.prototype, "listRewards", null);
__decorate([
    (0, common_1.Put)('rewards/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update partner reward' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PartnershipController.prototype, "updateReward", null);
__decorate([
    (0, common_1.Delete)('rewards/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete partner reward' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnershipController.prototype, "deleteReward", null);
__decorate([
    (0, common_1.Post)('redeem'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem partner reward with member points' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnershipController.prototype, "redeemReward", null);
exports.PartnershipController = PartnershipController = __decorate([
    (0, swagger_1.ApiTags)('Partnership'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('partnership'),
    __metadata("design:paramtypes", [typeof (_a = typeof partnership_service_1.PartnershipService !== "undefined" && partnership_service_1.PartnershipService) === "function" ? _a : Object])
], PartnershipController);


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebhookModule = void 0;
const common_1 = __webpack_require__(2);
const webhook_service_1 = __webpack_require__(132);
const webhook_controller_1 = __webpack_require__(133);
let WebhookModule = class WebhookModule {
};
exports.WebhookModule = WebhookModule;
exports.WebhookModule = WebhookModule = __decorate([
    (0, common_1.Module)({
        controllers: [webhook_controller_1.WebhookController],
        providers: [webhook_service_1.WebhookService],
        exports: [webhook_service_1.WebhookService],
    })
], WebhookModule);


/***/ }),
/* 132 */
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
exports.WebhookService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
let WebhookService = class WebhookService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEndpoint(data) {
        return this.prisma.webhookEndpoint.create({ data });
    }
    async listEndpoints(tenantId) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        return this.prisma.webhookEndpoint.findMany({ where, orderBy: { createdAt: 'desc' } });
    }
    async getEndpoint(id) {
        const endpoint = await this.prisma.webhookEndpoint.findUnique({ where: { id } });
        if (!endpoint)
            throw new common_1.NotFoundException('Webhook endpoint not found');
        return endpoint;
    }
    async updateEndpoint(id, data) {
        await this.getEndpoint(id);
        return this.prisma.webhookEndpoint.update({ where: { id }, data });
    }
    async deleteEndpoint(id) {
        await this.getEndpoint(id);
        await this.prisma.webhookEventLog.deleteMany({ where: { endpointId: id } });
        return this.prisma.webhookEndpoint.delete({ where: { id } });
    }
    async testEndpoint(id) {
        const endpoint = await this.getEndpoint(id);
        const payload = { event: 'test', timestamp: new Date().toISOString(), data: { message: 'Webhook test from Loyalty Platform' } };
        try {
            const response = await fetch(endpoint.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Secret': endpoint.secret || '',
                    'X-Event': 'test',
                },
                body: JSON.stringify(payload),
            });
            await this.prisma.webhookEventLog.create({
                data: {
                    endpointId: id,
                    event: 'test',
                    payload,
                    responseCode: response.status,
                    responseBody: await response.text(),
                    success: response.ok,
                },
            });
            return { success: response.ok, statusCode: response.status };
        }
        catch (error) {
            await this.prisma.webhookEventLog.create({
                data: {
                    endpointId: id,
                    event: 'test',
                    payload,
                    responseCode: 0,
                    responseBody: error.message,
                    success: false,
                },
            });
            return { success: false, error: error.message };
        }
    }
    async listLogs(endpointId, page = 1, limit = 20) {
        const where = {};
        if (endpointId)
            where.endpointId = endpointId;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.webhookEventLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.webhookEventLog.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getLog(id) {
        const log = await this.prisma.webhookEventLog.findUnique({ where: { id } });
        if (!log)
            throw new common_1.NotFoundException('Webhook log not found');
        return log;
    }
    async dispatch(eventName, payload, tenantId) {
        const endpoints = await this.prisma.webhookEndpoint.findMany({
            where: { tenantId, active: true, events: { has: eventName } },
        });
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Webhook-Secret': endpoint.secret || '',
                        'X-Event': eventName,
                    },
                    body: JSON.stringify({ event: eventName, timestamp: new Date().toISOString(), data: payload }),
                });
                await this.prisma.webhookEventLog.create({
                    data: {
                        endpointId: endpoint.id,
                        event: eventName,
                        payload,
                        responseCode: response.status,
                        responseBody: await response.text(),
                        success: response.ok,
                    },
                });
                if (!response.ok) {
                    await this.prisma.webhookEndpoint.update({ where: { id: endpoint.id }, data: { failureCount: { increment: 1 } } });
                }
            }
            catch (error) {
                await this.prisma.webhookEventLog.create({
                    data: {
                        endpointId: endpoint.id,
                        event: eventName,
                        payload,
                        responseCode: 0,
                        responseBody: error.message,
                        success: false,
                    },
                });
                await this.prisma.webhookEndpoint.update({ where: { id: endpoint.id }, data: { failureCount: { increment: 1 } } });
            }
        }
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], WebhookService);


/***/ }),
/* 133 */
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
exports.WebhookController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const webhook_service_1 = __webpack_require__(132);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let WebhookController = class WebhookController {
    webhookService;
    constructor(webhookService) {
        this.webhookService = webhookService;
    }
    createEndpoint(body) {
        return this.webhookService.createEndpoint(body);
    }
    listEndpoints(query) {
        return this.webhookService.listEndpoints(query.tenantId);
    }
    getEndpoint(id) {
        return this.webhookService.getEndpoint(id);
    }
    updateEndpoint(id, body) {
        return this.webhookService.updateEndpoint(id, body);
    }
    deleteEndpoint(id) {
        return this.webhookService.deleteEndpoint(id);
    }
    testEndpoint(id) {
        return this.webhookService.testEndpoint(id);
    }
    listLogs(query) {
        return this.webhookService.listLogs(query.endpointId, query.page, query.limit);
    }
    getLog(id) {
        return this.webhookService.getLog(id);
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)('endpoints'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create webhook endpoint' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "createEndpoint", null);
__decorate([
    (0, common_1.Get)('endpoints'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'List webhook endpoints' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "listEndpoints", null);
__decorate([
    (0, common_1.Get)('endpoints/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Get webhook endpoint' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "getEndpoint", null);
__decorate([
    (0, common_1.Put)('endpoints/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update webhook endpoint' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "updateEndpoint", null);
__decorate([
    (0, common_1.Delete)('endpoints/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete webhook endpoint' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "deleteEndpoint", null);
__decorate([
    (0, common_1.Post)('endpoints/:id/test'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Test webhook endpoint' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "testEndpoint", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'List webhook event logs' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "listLogs", null);
__decorate([
    (0, common_1.Get)('logs/:id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Get webhook event log' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "getLog", null);
exports.WebhookController = WebhookController = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [typeof (_a = typeof webhook_service_1.WebhookService !== "undefined" && webhook_service_1.WebhookService) === "function" ? _a : Object])
], WebhookController);


/***/ }),
/* 134 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GiftCardModule = void 0;
const common_1 = __webpack_require__(2);
const gift_card_service_1 = __webpack_require__(135);
const gift_card_controller_1 = __webpack_require__(136);
let GiftCardModule = class GiftCardModule {
};
exports.GiftCardModule = GiftCardModule;
exports.GiftCardModule = GiftCardModule = __decorate([
    (0, common_1.Module)({
        controllers: [gift_card_controller_1.GiftCardController],
        providers: [gift_card_service_1.GiftCardService],
        exports: [gift_card_service_1.GiftCardService],
    })
], GiftCardModule);


/***/ }),
/* 135 */
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
exports.GiftCardService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
const crypto = __importStar(__webpack_require__(63));
let GiftCardService = class GiftCardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const code = 'GC' + crypto.randomBytes(4).toString('hex').toUpperCase();
        return this.prisma.giftCard.create({
            data: {
                code,
                initialValue: data.initialValue,
                balance: data.initialValue,
                type: data.type || 'digital',
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                tenantId: data.tenantId,
            },
        });
    }
    async findAll(tenantId, page = 1, limit = 20, search, status, sort) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (status)
            where.status = status;
        if (search) {
            where.OR = [{ code: { contains: search, mode: 'insensitive' } }];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.giftCard.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
            this.prisma.giftCard.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const card = await this.prisma.giftCard.findUnique({ where: { id } });
        if (!card)
            throw new common_1.NotFoundException('Gift card not found');
        return card;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.giftCard.update({ where: { id }, data });
    }
    async assign(id, memberId) {
        const card = await this.findOne(id);
        const member = await this.prisma.member.findUnique({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (card.status !== 'ACTIVE')
            throw new common_1.BadRequestException('Gift card is not active');
        await this.prisma.memberGiftCard.create({ data: { memberId, giftCardId: id, balance: card.balance } });
        return { message: 'Gift card assigned successfully' };
    }
    async getMemberGiftCards(memberId) {
        return this.prisma.memberGiftCard.findMany({
            where: { memberId },
            include: { giftCard: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async redeem(id, memberId, amount) {
        const card = await this.findOne(id);
        if (card.balance < amount)
            throw new common_1.BadRequestException('Insufficient gift card balance');
        const memberCard = await this.prisma.memberGiftCard.findFirst({
            where: { giftCardId: id, memberId },
        });
        if (!memberCard)
            throw new common_1.BadRequestException('Gift card not assigned to this member');
        await this.prisma.$transaction(async (tx) => {
            await tx.giftCard.update({ where: { id }, data: { balance: { decrement: amount } } });
            await tx.memberGiftCard.update({ where: { id: memberCard.id }, data: { balance: { decrement: amount } } });
        });
        return { message: 'Gift card redeemed successfully', amount };
    }
};
exports.GiftCardService = GiftCardService;
exports.GiftCardService = GiftCardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], GiftCardService);


/***/ }),
/* 136 */
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
exports.GiftCardController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const gift_card_service_1 = __webpack_require__(135);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let GiftCardController = class GiftCardController {
    giftCardService;
    constructor(giftCardService) {
        this.giftCardService = giftCardService;
    }
    create(body) {
        return this.giftCardService.create(body);
    }
    findAll(query) {
        return this.giftCardService.findAll(query.tenantId, query.page, query.limit, query.search, query.status, query.sort);
    }
    findOne(id) {
        return this.giftCardService.findOne(id);
    }
    update(id, body) {
        return this.giftCardService.update(id, body);
    }
    assign(id, body) {
        return this.giftCardService.assign(id, body.memberId);
    }
    getMemberGiftCards(memberId) {
        return this.giftCardService.getMemberGiftCards(memberId);
    }
    redeem(id, body) {
        return this.giftCardService.redeem(id, body.memberId, body.amount);
    }
};
exports.GiftCardController = GiftCardController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a gift card' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GiftCardController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'List gift cards' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GiftCardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Get gift card by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GiftCardController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update gift card' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GiftCardController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign gift card to member' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GiftCardController.prototype, "assign", null);
__decorate([
    (0, common_1.Get)('member/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member gift cards' }),
    __param(0, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GiftCardController.prototype, "getMemberGiftCards", null);
__decorate([
    (0, common_1.Post)(':id/redeem'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem gift card balance' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GiftCardController.prototype, "redeem", null);
exports.GiftCardController = GiftCardController = __decorate([
    (0, swagger_1.ApiTags)('Gift Cards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('gift-cards'),
    __metadata("design:paramtypes", [typeof (_a = typeof gift_card_service_1.GiftCardService !== "undefined" && gift_card_service_1.GiftCardService) === "function" ? _a : Object])
], GiftCardController);


/***/ }),
/* 137 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackModule = void 0;
const common_1 = __webpack_require__(2);
const feedback_service_1 = __webpack_require__(138);
const feedback_controller_1 = __webpack_require__(139);
let FeedbackModule = class FeedbackModule {
};
exports.FeedbackModule = FeedbackModule;
exports.FeedbackModule = FeedbackModule = __decorate([
    (0, common_1.Module)({
        controllers: [feedback_controller_1.FeedbackController],
        providers: [feedback_service_1.FeedbackService],
        exports: [feedback_service_1.FeedbackService],
    })
], FeedbackModule);


/***/ }),
/* 138 */
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
exports.FeedbackService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let FeedbackService = class FeedbackService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.memberFeedback.create({ data });
    }
    async findAll(tenantId, page = 1, limit = 20, entityType, entityId, rating, status, sort) {
        const where = {};
        if (entityType)
            where.entityType = entityType;
        if (entityId)
            where.entityId = entityId;
        if (rating)
            where.rating = rating;
        if (status)
            where.status = status;
        if (tenantId) {
            where.member = { tenantId };
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.memberFeedback.findMany({
                where,
                orderBy: { [orderBy]: orderDirection },
                skip,
                take: limit,
                include: { member: { select: { id: true, fullName: true, avatar: true } } },
            }),
            this.prisma.memberFeedback.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const feedback = await this.prisma.memberFeedback.findUnique({ where: { id }, include: { member: { select: { id: true, fullName: true, avatar: true } } } });
        if (!feedback)
            throw new common_1.NotFoundException('Feedback not found');
        return feedback;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.memberFeedback.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.memberFeedback.delete({ where: { id } });
    }
    async getPublic(entityType, entityId) {
        const feedbacks = await this.prisma.memberFeedback.findMany({
            where: { entityType, entityId, status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' },
            include: { member: { select: { id: true, fullName: true, avatar: true } } },
        });
        const stats = await this.prisma.memberFeedback.groupBy({
            by: ['rating'],
            where: { entityType, entityId, status: 'PUBLISHED' },
            _count: { rating: true },
        });
        const total = feedbacks.length;
        const averageRating = total > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / total : 0;
        return { feedbacks, stats: { total, averageRating, distribution: stats } };
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], FeedbackService);


/***/ }),
/* 139 */
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
exports.FeedbackController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const feedback_service_1 = __webpack_require__(138);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let FeedbackController = class FeedbackController {
    feedbackService;
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    create(body) {
        return this.feedbackService.create(body);
    }
    findAll(query) {
        return this.feedbackService.findAll(query.tenantId, query.page, query.limit, query.entityType, query.entityId, query.rating, query.status, query.sort);
    }
    findOne(id) {
        return this.feedbackService.findOne(id);
    }
    update(id, body) {
        return this.feedbackService.update(id, body);
    }
    remove(id) {
        return this.feedbackService.remove(id);
    }
    getPublic(entityType, entityId) {
        return this.feedbackService.getPublic(entityType, entityId);
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('MEMBER'),
    (0, swagger_1.ApiOperation)({ summary: 'Create feedback/review' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'List feedback (admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get feedback by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update feedback status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete feedback' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('public/:entityType/:entityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public feedback for entity' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "getPublic", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, swagger_1.ApiTags)('Feedback'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('feedback'),
    __metadata("design:paramtypes", [typeof (_a = typeof feedback_service_1.FeedbackService !== "undefined" && feedback_service_1.FeedbackService) === "function" ? _a : Object])
], FeedbackController);


/***/ }),
/* 140 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductModule = void 0;
const common_1 = __webpack_require__(2);
const product_service_1 = __webpack_require__(141);
const product_controller_1 = __webpack_require__(142);
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService],
    })
], ProductModule);


/***/ }),
/* 141 */
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
exports.ProductService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let ProductService = class ProductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existing = await this.prisma.product.findUnique({ where: { slug_tenantId: { slug, tenantId: data.tenantId } } });
        if (existing)
            throw new common_1.BadRequestException('Product slug already exists');
        if (data.sku) {
            const skuExists = await this.prisma.product.findUnique({ where: { sku_tenantId: { sku: data.sku, tenantId: data.tenantId } } });
            if (skuExists)
                throw new common_1.BadRequestException('Product SKU already exists');
        }
        return this.prisma.product.create({ data: { ...data, slug } });
    }
    async findAll(tenantId, page = 1, limit = 20, search, categoryId, status, sort) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { barcode: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (categoryId)
            where.categoryId = categoryId;
        if (status)
            where.status = status;
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.product.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit, include: { category: true } }),
            this.prisma.product.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({ where: { id }, include: { category: true } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.product.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.delete({ where: { id } });
    }
    async bulkDelete(ids) {
        const result = await this.prisma.product.deleteMany({ where: { id: { in: ids } } });
        return { deleted: result.count };
    }
    async bulkStatus(ids, status) {
        const result = await this.prisma.product.updateMany({
            where: { id: { in: ids } },
            data: { status },
        });
        return { updated: result.count };
    }
    async lowStock(tenantId, threshold = 10) {
        const where = { stock: { lte: threshold } };
        if (tenantId)
            where.tenantId = tenantId;
        const [data, total] = await Promise.all([
            this.prisma.product.findMany({ where, orderBy: { stock: 'asc' }, take: 50, include: { category: true } }),
            this.prisma.product.count({ where }),
        ]);
        const outOfStock = data.filter(p => p.stock === 0).length;
        const lowStock = data.filter(p => p.stock > 0 && p.stock <= threshold).length;
        return { data, total, outOfStock, lowStock, threshold };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ProductService);


/***/ }),
/* 142 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const product_service_1 = __webpack_require__(141);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const product_dto_1 = __webpack_require__(143);
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    create(req, body) {
        return this.productService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
    }
    findAll(req, query) {
        return this.productService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.categoryId, query.status, query.sort);
    }
    lowStock(req, threshold) {
        return this.productService.lowStock(req.tenantId, threshold || 10);
    }
    bulkDelete(body) {
        return this.productService.bulkDelete(body.ids);
    }
    bulkStatus(body) {
        return this.productService.bulkStatus(body.ids, body.status);
    }
    findOne(id) {
        return this.productService.findOne(id);
    }
    update(id, body) {
        return this.productService.update(id, body);
    }
    remove(id) {
        return this.productService.remove(id);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a product' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof product_dto_1.CreateProductDto !== "undefined" && product_dto_1.CreateProductDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List products (with pagination & filter)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof product_dto_1.ProductQueryDto !== "undefined" && product_dto_1.ProductQueryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get products with low stock (≤ threshold)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "lowStock", null);
__decorate([
    (0, common_1.Post)('bulk/delete'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk delete products' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Post)('bulk/status'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update product status' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "bulkStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof product_dto_1.UpdateProductDto !== "undefined" && product_dto_1.UpdateProductDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete product' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "remove", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [typeof (_a = typeof product_service_1.ProductService !== "undefined" && product_service_1.ProductService) === "function" ? _a : Object])
], ProductController);


/***/ }),
/* 143 */
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
exports.ProductQueryDto = exports.UpdateProductDto = exports.CreateProductDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
class CreateProductDto {
    name;
    slug;
    description;
    price;
    compareAtPrice;
    costPrice;
    imageUrl;
    unit;
    stock;
    sku;
    barcode;
    categoryId;
    tenantId;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "compareAtPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "tenantId", void 0);
class UpdateProductDto {
    name;
    slug;
    description;
    price;
    compareAtPrice;
    costPrice;
    imageUrl;
    unit;
    stock;
    sku;
    barcode;
    status;
    categoryId;
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "compareAtPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "categoryId", void 0);
class ProductQueryDto {
    tenantId;
    page;
    limit;
    search;
    categoryId;
    status;
    sort;
}
exports.ProductQueryDto = ProductQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "sort", void 0);


/***/ }),
/* 144 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductCategoryModule = void 0;
const common_1 = __webpack_require__(2);
const product_category_service_1 = __webpack_require__(145);
const product_category_controller_1 = __webpack_require__(146);
let ProductCategoryModule = class ProductCategoryModule {
};
exports.ProductCategoryModule = ProductCategoryModule;
exports.ProductCategoryModule = ProductCategoryModule = __decorate([
    (0, common_1.Module)({
        controllers: [product_category_controller_1.ProductCategoryController],
        providers: [product_category_service_1.ProductCategoryService],
    })
], ProductCategoryModule);


/***/ }),
/* 145 */
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
exports.ProductCategoryService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
let ProductCategoryService = class ProductCategoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existing = await this.prisma.productCategory.findUnique({ where: { slug_tenantId: { slug, tenantId: data.tenantId } } });
        if (existing)
            throw new common_1.BadRequestException('Category slug already exists');
        return this.prisma.productCategory.create({ data: { ...data, slug } });
    }
    async findAll(tenantId, page = 1, limit = 20, search, sort) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
            ];
        }
        const orderBy = sort || 'sortOrder';
        const orderDirection = sort?.startsWith('-') ? 'desc' : 'asc';
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.productCategory.findMany({
                where,
                orderBy: { [orderBy.replace(/^-/, '')]: orderDirection },
                skip,
                take: limit,
                include: { _count: { select: { products: true } } },
            }),
            this.prisma.productCategory.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const category = await this.prisma.productCategory.findUnique({
            where: { id },
            include: { _count: { select: { products: true } } },
        });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.productCategory.update({ where: { id }, data });
    }
    async remove(id) {
        const productCount = await this.prisma.product.count({ where: { categoryId: id } });
        if (productCount > 0)
            throw new common_1.BadRequestException('Cannot delete category with existing products');
        await this.findOne(id);
        return this.prisma.productCategory.delete({ where: { id } });
    }
};
exports.ProductCategoryService = ProductCategoryService;
exports.ProductCategoryService = ProductCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ProductCategoryService);


/***/ }),
/* 146 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductCategoryController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const product_category_service_1 = __webpack_require__(145);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const product_category_dto_1 = __webpack_require__(147);
let ProductCategoryController = class ProductCategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    create(req, body) {
        return this.categoryService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
    }
    findAll(req, query) {
        return this.categoryService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.sort);
    }
    findOne(id) {
        return this.categoryService.findOne(id);
    }
    update(id, body) {
        return this.categoryService.update(id, body);
    }
    remove(id) {
        return this.categoryService.remove(id);
    }
};
exports.ProductCategoryController = ProductCategoryController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a product category' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof product_category_dto_1.CreateProductCategoryDto !== "undefined" && product_category_dto_1.CreateProductCategoryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ProductCategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List product categories' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof product_category_dto_1.ProductCategoryQueryDto !== "undefined" && product_category_dto_1.ProductCategoryQueryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ProductCategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductCategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update category' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof product_category_dto_1.UpdateProductCategoryDto !== "undefined" && product_category_dto_1.UpdateProductCategoryDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], ProductCategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete category' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductCategoryController.prototype, "remove", null);
exports.ProductCategoryController = ProductCategoryController = __decorate([
    (0, swagger_1.ApiTags)('Product Categories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('product-categories'),
    __metadata("design:paramtypes", [typeof (_a = typeof product_category_service_1.ProductCategoryService !== "undefined" && product_category_service_1.ProductCategoryService) === "function" ? _a : Object])
], ProductCategoryController);


/***/ }),
/* 147 */
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
exports.ProductCategoryQueryDto = exports.UpdateProductCategoryDto = exports.CreateProductCategoryDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
class CreateProductCategoryDto {
    name;
    slug;
    description;
    icon;
    sortOrder;
    tenantId;
}
exports.CreateProductCategoryDto = CreateProductCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductCategoryDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductCategoryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductCategoryDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductCategoryDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductCategoryDto.prototype, "tenantId", void 0);
class UpdateProductCategoryDto {
    name;
    slug;
    description;
    icon;
    sortOrder;
}
exports.UpdateProductCategoryDto = UpdateProductCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductCategoryDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductCategoryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductCategoryDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductCategoryDto.prototype, "sortOrder", void 0);
class ProductCategoryQueryDto {
    tenantId;
    page;
    limit;
    search;
    sort;
}
exports.ProductCategoryQueryDto = ProductCategoryQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductCategoryQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProductCategoryQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProductCategoryQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductCategoryQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductCategoryQueryDto.prototype, "sort", void 0);


/***/ }),
/* 148 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderModule = void 0;
const common_1 = __webpack_require__(2);
const order_service_1 = __webpack_require__(149);
const order_controller_1 = __webpack_require__(155);
const coupon_module_1 = __webpack_require__(157);
const point_module_1 = __webpack_require__(49);
const websocket_module_1 = __webpack_require__(160);
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [coupon_module_1.CouponModule, point_module_1.PointModule, websocket_module_1.WebSocketModule],
        controllers: [order_controller_1.OrderController],
        providers: [order_service_1.OrderService],
    })
], OrderModule);


/***/ }),
/* 149 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const coupon_service_1 = __webpack_require__(150);
const point_service_1 = __webpack_require__(50);
const websocket_gateway_1 = __webpack_require__(151);
const sort_util_1 = __webpack_require__(30);
let OrderService = class OrderService {
    prisma;
    couponService;
    pointService;
    wsGateway;
    constructor(prisma, couponService, pointService, wsGateway) {
        this.prisma = prisma;
        this.couponService = couponService;
        this.pointService = pointService;
        this.wsGateway = wsGateway;
    }
    async create(data) {
        const member = await this.prisma.member.findUnique({ where: { id: data.memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const productIds = data.items.map(i => i.productId);
        const products = await this.prisma.product.findMany({ where: { id: { in: productIds }, tenantId: data.tenantId } });
        if (products.length !== productIds.length)
            throw new common_1.BadRequestException('Some products not found');
        const productMap = new Map(products.map(p => [p.id, p]));
        let subtotal = 0;
        const orderItems = data.items.map(item => {
            const product = productMap.get(item.productId);
            if (product.status !== 'ACTIVE')
                throw new common_1.BadRequestException(`Product ${product.name} is not available`);
            const price = item.price ?? product.price;
            const lineTotal = price * item.quantity;
            subtotal += lineTotal;
            return { productId: item.productId, name: product.name, price, quantity: item.quantity, subtotal: lineTotal };
        });
        let discount = data.discount ?? 0;
        let couponCode = data.couponCode;
        if (data.couponCode) {
            try {
                const result = await this.couponService.validate(data.couponCode, data.memberId, subtotal - discount, data.tenantId);
                if (result.valid) {
                    discount += result.discount;
                    couponCode = data.couponCode;
                }
            }
            catch { }
        }
        const shippingFee = data.shippingFee ?? 0;
        const tax = data.tax ?? 0;
        const total = Math.max(0, subtotal - discount + shippingFee + tax);
        const orderCode = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const earningRule = await this.prisma.pointEarningRule.findFirst({
            where: { tenantId: data.tenantId, status: 'ACTIVE', category: null },
            orderBy: { createdAt: 'desc' },
        });
        const pointsEarned = earningRule ? Math.floor(total * Number(earningRule.pointsPerUnit)) : Math.floor(total);
        const order = await this.prisma.order.create({
            data: {
                orderCode,
                memberId: data.memberId,
                tenantId: data.tenantId,
                storeId: data.storeId,
                subtotal,
                discount,
                shippingFee,
                tax,
                total,
                pointsEarned,
                couponCode,
                notes: data.notes,
                shippingAddress: data.shippingAddress ?? undefined,
                paymentMethod: data.paymentMethod,
                items: { create: orderItems },
            },
            include: { items: true },
        });
        await this.prisma.member.update({
            where: { id: data.memberId },
            data: {
                totalPoints: { increment: pointsEarned },
                availablePoints: { increment: pointsEarned },
            },
        });
        await this.prisma.pointTransaction.create({
            data: {
                memberId: data.memberId,
                type: 'EARN',
                amount: pointsEarned,
                balance: member.availablePoints + pointsEarned,
                reason: `Points from order ${orderCode}`,
                reference: order.id,
            },
        });
        if (data.couponCode) {
            try {
                await this.couponService.apply(data.couponCode, data.memberId, order.id, subtotal, data.tenantId);
            }
            catch { }
        }
        try {
            this.wsGateway.emitOrderCreated(order);
            this.wsGateway.emitPointsEarned(data.memberId, pointsEarned, member.availablePoints + pointsEarned, `Points from order ${orderCode}`);
            if (data.couponCode) {
                this.wsGateway.emitCouponApplied(data.couponCode, data.memberId, discount, orderCode);
            }
        }
        catch { }
        return order;
    }
    async findAll(query) {
        const { tenantId, memberId, page = 1, limit = 20, status, search, sort } = query;
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (memberId)
            where.memberId = memberId;
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { orderCode: { contains: search, mode: 'insensitive' } },
                { member: { fullName: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit, include: { items: { include: { product: true } }, member: { select: { id: true, fullName: true, email: true } } } }),
            this.prisma.order.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } }, member: { select: { id: true, fullName: true, email: true, phone: true } } },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updateStatus(id, status, cancelReason) {
        const order = await this.findOne(id);
        const validTransitions = {
            PENDING: ['CONFIRMED', 'CANCELLED'],
            CONFIRMED: ['PROCESSING', 'CANCELLED'],
            PROCESSING: ['SHIPPED', 'CANCELLED'],
            SHIPPED: ['DELIVERED', 'CANCELLED'],
            DELIVERED: [],
            CANCELLED: ['REFUNDED'],
            REFUNDED: [],
        };
        const allowed = validTransitions[order.status] || [];
        if (!allowed.includes(status))
            throw new common_1.BadRequestException(`Cannot transition from ${order.status} to ${status}`);
        const historyEntry = {
            from: order.status,
            to: status,
            timestamp: new Date().toISOString(),
        };
        const currentHistory = Array.isArray(order.statusHistory) ? order.statusHistory : [];
        const updateData = {
            status,
            statusHistory: [...currentHistory, historyEntry],
        };
        if (status === 'CANCELLED') {
            updateData.cancelledAt = new Date();
            updateData.cancelReason = cancelReason;
        }
        if (status === 'DELIVERED')
            updateData.deliveredAt = new Date();
        const updated = await this.prisma.order.update({
            where: { id },
            data: updateData,
            include: { items: true, member: { select: { id: true, fullName: true, email: true, tenantId: true } } },
        });
        if (status === 'CANCELLED' && order.pointsEarned > 0) {
            try {
                const member = await this.prisma.member.findUnique({ where: { id: order.memberId } });
                if (member && member.availablePoints >= order.pointsEarned) {
                    await this.prisma.$transaction([
                        this.prisma.pointTransaction.create({
                            data: {
                                memberId: order.memberId,
                                type: 'ADJUST',
                                amount: -order.pointsEarned,
                                balance: member.availablePoints - order.pointsEarned,
                                reason: `Points reversed from cancelled order ${order.orderCode}`,
                                reference: order.id,
                            },
                        }),
                        this.prisma.member.update({
                            where: { id: order.memberId },
                            data: {
                                totalPoints: { decrement: order.pointsEarned },
                                availablePoints: { decrement: order.pointsEarned },
                            },
                        }),
                    ]);
                }
            }
            catch (err) {
            }
        }
        try {
            this.wsGateway.emitOrderStatusChanged(id, order.orderCode, status, order.memberId);
        }
        catch { }
        return updated;
    }
    async getTimeline(id) {
        const order = await this.findOne(id);
        return {
            orderCode: order.orderCode,
            status: order.status,
            history: Array.isArray(order.statusHistory) ? order.statusHistory : [],
            createdAt: order.createdAt,
            deliveredAt: order.deliveredAt,
            cancelledAt: order.cancelledAt,
        };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof coupon_service_1.CouponService !== "undefined" && coupon_service_1.CouponService) === "function" ? _b : Object, typeof (_c = typeof point_service_1.PointService !== "undefined" && point_service_1.PointService) === "function" ? _c : Object, typeof (_d = typeof websocket_gateway_1.WebSocketGatewayImpl !== "undefined" && websocket_gateway_1.WebSocketGatewayImpl) === "function" ? _d : Object])
], OrderService);


/***/ }),
/* 150 */
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
exports.CouponService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
let CouponService = class CouponService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.coupon.findUnique({
            where: { code_tenantId: { code: data.code, tenantId: data.tenantId } },
        });
        if (existing)
            throw new common_1.BadRequestException(`Coupon code "${data.code}" already exists`);
        return this.prisma.coupon.create({
            data: {
                code: data.code.toUpperCase(),
                type: data.type,
                value: data.value,
                minAmount: data.minAmount,
                maxDiscount: data.maxDiscount,
                maxUsage: data.maxUsage,
                maxUsagePerMember: data.maxUsagePerMember ?? 1,
                description: data.description,
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
                status: data.status ?? 'ACTIVE',
                tenantId: data.tenantId,
            },
        });
    }
    async findAll(params) {
        const { tenantId, page = 1, limit = 20, status, search, sort } = params;
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.coupon.findMany({
                where, orderBy: { [orderBy]: orderDirection }, skip, take: limit,
                include: { _count: { select: { usages: true } } },
            }),
            this.prisma.coupon.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id },
            include: { _count: { select: { usages: true } } },
        });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        return coupon;
    }
    async update(id, data) {
        await this.findOne(id);
        const updateData = { ...data };
        if (data.startDate)
            updateData.startDate = new Date(data.startDate);
        if (data.endDate)
            updateData.endDate = new Date(data.endDate);
        if (data.code)
            updateData.code = data.code.toUpperCase();
        return this.prisma.coupon.update({ where: { id }, data: updateData });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.coupon.delete({ where: { id } });
    }
    async validate(couponCode, memberId, orderTotal, tenantId) {
        const where = { code: couponCode.toUpperCase() };
        if (tenantId)
            where.tenantId = tenantId;
        const coupon = await this.prisma.coupon.findFirst({ where });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        const errors = [];
        const now = new Date();
        if (coupon.status !== 'ACTIVE')
            errors.push('Coupon is not active');
        if (coupon.startDate && now < coupon.startDate)
            errors.push('Coupon is not yet valid');
        if (coupon.endDate && now > coupon.endDate)
            errors.push('Coupon has expired');
        if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage)
            errors.push('Coupon usage limit reached');
        if (coupon.minAmount && orderTotal < coupon.minAmount)
            errors.push(`Minimum order amount is ${coupon.minAmount.toLocaleString()} VND`);
        if (coupon.maxUsagePerMember) {
            const memberUsageCount = await this.prisma.couponUsage.count({
                where: { couponId: coupon.id, memberId },
            });
            if (memberUsageCount >= coupon.maxUsagePerMember)
                errors.push('Coupon usage limit reached for this member');
        }
        let discount = 0;
        if (errors.length === 0) {
            if (coupon.type === 'PERCENTAGE') {
                discount = Math.round(orderTotal * (coupon.value / 100));
                if (coupon.maxDiscount)
                    discount = Math.min(discount, coupon.maxDiscount);
            }
            else {
                discount = coupon.value;
            }
            if (discount > orderTotal)
                discount = orderTotal;
        }
        return { valid: errors.length === 0, coupon, errors, discount };
    }
    async apply(couponCode, memberId, orderId, orderTotal, tenantId) {
        const validation = await this.validate(couponCode, memberId, orderTotal, tenantId);
        if (!validation.valid)
            throw new common_1.BadRequestException(validation.errors.join('; '));
        await this.prisma.$transaction([
            this.prisma.coupon.update({
                where: { id: validation.coupon.id },
                data: { usedCount: { increment: 1 } },
            }),
            this.prisma.couponUsage.create({
                data: {
                    couponId: validation.coupon.id,
                    memberId,
                    orderId,
                    discountAmount: validation.discount,
                },
            }),
        ]);
        return { discount: validation.discount, couponCode: validation.coupon.code };
    }
    async getPerformanceStats(tenantId) {
        const couponWhere = {};
        if (tenantId)
            couponWhere.tenantId = tenantId;
        const coupons = await this.prisma.coupon.findMany({ where: couponWhere, include: { _count: { select: { usages: true } } } });
        const totalCoupons = coupons.length;
        const activeCoupons = coupons.filter(c => c.status === 'ACTIVE').length;
        const totalUsage = coupons.reduce((s, c) => s + c.usedCount, 0);
        const couponIds = coupons.map(c => c.id);
        const totalDiscount = couponIds.length > 0
            ? await this.prisma.couponUsage.aggregate({ where: { couponId: { in: couponIds } }, _sum: { discountAmount: true } })
            : { _sum: { discountAmount: 0 } };
        const topCoupons = coupons.sort((a, b) => b.usedCount - a.usedCount).slice(0, 5);
        return {
            totalCoupons,
            activeCoupons,
            totalUsage,
            totalDiscountAmount: totalDiscount._sum.discountAmount || 0,
            topCoupons: topCoupons.map(c => ({ id: c.id, code: c.code, type: c.type, value: c.value, usedCount: c.usedCount })),
        };
    }
    async getUsageReport(couponId) {
        await this.findOne(couponId);
        const usages = await this.prisma.couponUsage.findMany({
            where: { couponId },
            include: { member: { select: { fullName: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return usages;
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CouponService);


/***/ }),
/* 151 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocketGatewayImpl = void 0;
const websockets_1 = __webpack_require__(152);
const socket_io_1 = __webpack_require__(153);
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(11);
const prisma_service_1 = __webpack_require__(16);
const websocket_event_service_1 = __webpack_require__(154);
let WebSocketGatewayImpl = class WebSocketGatewayImpl {
    jwtService;
    prisma;
    eventService;
    server;
    constructor(jwtService, prisma, eventService) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.eventService = eventService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.query.token || client.handshake.auth?.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            client.userId = payload.sub || payload.id;
            client.role = payload.role;
            if (client.role === 'MEMBER' || payload.memberId) {
                client.memberId = payload.memberId;
                client.join(`member:${payload.memberId}`);
            }
            else if (client.role && ['HOST', 'ADMIN', 'STAFF'].includes(client.role)) {
                client.tenantId = payload.tenantId;
                client.join('admin');
                if (payload.tenantId)
                    client.join(`tenant:${payload.tenantId}`);
            }
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect() { }
    handlePing(client) {
        client.emit('pong', { time: new Date().toISOString() });
    }
    async handleReplay(client, payload) {
        const events = await this.eventService.replay(payload.room, client.memberId, payload.since, payload.limit || 50);
        client.emit('replay.events', events);
    }
    async emitToRoom(room, event, data, memberId, tenantId) {
        this.server.to(room).emit(event, data);
        await this.eventService.log(event, data, room, memberId, tenantId).catch(() => { });
    }
    emitOrderCreated(order) {
        const adminData = {
            id: order.id, orderCode: order.orderCode, total: order.total,
            status: order.status, memberId: order.memberId,
            pointsEarned: order.pointsEarned, couponCode: order.couponCode,
            createdAt: order.createdAt,
        };
        this.emitToRoom('admin', 'order.created', adminData, undefined, order.tenantId);
        const memberData = {
            id: order.id, orderCode: order.orderCode, total: order.total,
            status: order.status, pointsEarned: order.pointsEarned,
        };
        this.emitToRoom(`member:${order.memberId}`, 'order.created', memberData, order.memberId);
    }
    emitOrderStatusChanged(orderId, orderCode, status, memberId, tenantId) {
        const data = { orderId, orderCode, status };
        this.emitToRoom('admin', 'order.status_changed', data, memberId, tenantId);
        this.emitToRoom(`member:${memberId}`, 'order.status_changed', data, memberId);
    }
    emitPointsEarned(memberId, amount, balance, reason, tenantId) {
        this.emitToRoom(`member:${memberId}`, 'points.earned', { amount, balance, reason }, memberId);
        this.emitToRoom('admin', 'points.earned', { memberId, amount, balance, reason }, memberId, tenantId);
    }
    emitCouponApplied(couponCode, memberId, discount, orderCode, tenantId) {
        this.emitToRoom('admin', 'coupon.applied', { couponCode, memberId, discount, orderCode }, memberId, tenantId);
    }
    emitNotification(userId, notification) {
        this.emitToRoom(`member:${userId}`, 'notification', notification, userId);
        this.emitToRoom('admin', 'notification', notification);
    }
};
exports.WebSocketGatewayImpl = WebSocketGatewayImpl;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_d = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _d : Object)
], WebSocketGatewayImpl.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebSocketGatewayImpl.prototype, "handlePing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('replay'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGatewayImpl.prototype, "handleReplay", null);
exports.WebSocketGatewayImpl = WebSocketGatewayImpl = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*', credentials: true },
        namespace: '/ws',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object, typeof (_c = typeof websocket_event_service_1.WebSocketEventService !== "undefined" && websocket_event_service_1.WebSocketEventService) === "function" ? _c : Object])
], WebSocketGatewayImpl);


/***/ }),
/* 152 */
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),
/* 153 */
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),
/* 154 */
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
exports.WebSocketEventService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
let WebSocketEventService = class WebSocketEventService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(event, payload, room, memberId, tenantId) {
        return this.prisma.webSocketEventLog.create({
            data: { event, payload: payload, room, memberId, tenantId },
        });
    }
    async replay(room, memberId, since, limit = 50) {
        const where = {};
        if (room)
            where.room = room;
        if (memberId)
            where.memberId = memberId;
        if (since)
            where.createdAt = { gte: new Date(since) };
        return this.prisma.webSocketEventLog.findMany({
            where,
            orderBy: { createdAt: 'asc' },
            take: limit,
        });
    }
    async getRecent(limit = 50) {
        return this.prisma.webSocketEventLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
};
exports.WebSocketEventService = WebSocketEventService;
exports.WebSocketEventService = WebSocketEventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], WebSocketEventService);


/***/ }),
/* 155 */
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
exports.OrderController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const order_service_1 = __webpack_require__(149);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const order_dto_1 = __webpack_require__(156);
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    create(req, body) {
        return this.orderService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
    }
    findAll(req, query) {
        return this.orderService.findAll({ ...query, tenantId: req.tenantId ?? query.tenantId });
    }
    findOne(id) {
        return this.orderService.findOne(id);
    }
    updateStatus(id, body) {
        return this.orderService.updateStatus(id, body.status, body.cancelReason);
    }
    findByMember(memberId, query) {
        return this.orderService.findAll({ ...query, memberId });
    }
    getTimeline(id) {
        return this.orderService.getTimeline(id);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF', 'MEMBER'),
    (0, swagger_1.ApiOperation)({ summary: 'Create order with point earning' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof order_dto_1.CreateOrderDto !== "undefined" && order_dto_1.CreateOrderDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'List orders (with pagination & filter)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof order_dto_1.OrderQueryDto !== "undefined" && order_dto_1.OrderQueryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof order_dto_1.UpdateOrderStatusDto !== "undefined" && order_dto_1.UpdateOrderStatusDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('member/:memberId'),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF', 'MEMBER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get orders by member' }),
    __param(0, (0, common_1.Param)('memberId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof order_dto_1.OrderQueryDto !== "undefined" && order_dto_1.OrderQueryDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findByMember", null);
__decorate([
    (0, common_1.Get)(':id/timeline'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order status change timeline' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getTimeline", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [typeof (_a = typeof order_service_1.OrderService !== "undefined" && order_service_1.OrderService) === "function" ? _a : Object])
], OrderController);


/***/ }),
/* 156 */
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
exports.OrderQueryDto = exports.UpdateOrderStatusDto = exports.CreateOrderDto = void 0;
const class_validator_1 = __webpack_require__(25);
const class_transformer_1 = __webpack_require__(76);
const swagger_1 = __webpack_require__(3);
class OrderItemDto {
    productId;
    quantity;
    price;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "price", void 0);
class CreateOrderDto {
    memberId;
    tenantId;
    storeId;
    items;
    shippingFee;
    tax;
    discount;
    couponCode;
    paymentMethod;
    notes;
    shippingAddress;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "storeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OrderItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "shippingFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "couponCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateOrderDto.prototype, "shippingAddress", void 0);
class UpdateOrderStatusDto {
    status;
    cancelReason;
}
exports.UpdateOrderStatusDto = UpdateOrderStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "cancelReason", void 0);
class OrderQueryDto {
    tenantId;
    memberId;
    page;
    limit;
    status;
    search;
    sort;
}
exports.OrderQueryDto = OrderQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderQueryDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], OrderQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], OrderQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderQueryDto.prototype, "sort", void 0);


/***/ }),
/* 157 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CouponModule = void 0;
const common_1 = __webpack_require__(2);
const coupon_controller_1 = __webpack_require__(158);
const coupon_service_1 = __webpack_require__(150);
const common_module_1 = __webpack_require__(46);
let CouponModule = class CouponModule {
};
exports.CouponModule = CouponModule;
exports.CouponModule = CouponModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule],
        controllers: [coupon_controller_1.CouponController],
        providers: [coupon_service_1.CouponService],
        exports: [coupon_service_1.CouponService],
    })
], CouponModule);


/***/ }),
/* 158 */
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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CouponController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const coupon_service_1 = __webpack_require__(150);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const coupon_dto_1 = __webpack_require__(159);
let CouponController = class CouponController {
    couponService;
    constructor(couponService) {
        this.couponService = couponService;
    }
    create(req, body) {
        return this.couponService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
    }
    findAll(req, query) {
        return this.couponService.findAll({ ...query, tenantId: req.tenantId ?? query.tenantId });
    }
    findOne(id) {
        return this.couponService.findOne(id);
    }
    update(id, body) {
        return this.couponService.update(id, body);
    }
    remove(id) {
        return this.couponService.remove(id);
    }
    validate(body) {
        return this.couponService.validate(body.code, body.memberId, body.orderTotal, body.tenantId);
    }
    async apply(body) {
        const result = await this.couponService.validate(body.code, body.memberId, body.orderTotal, body.tenantId);
        return { valid: result.valid, discount: result.discount, couponCode: result.coupon?.code, errors: result.errors };
    }
    getPerformanceStats(req, tenantId) {
        return this.couponService.getPerformanceStats(req.tenantId ?? tenantId);
    }
    getUsageReport(id) {
        return this.couponService.getUsageReport(id);
    }
};
exports.CouponController = CouponController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new coupon' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof coupon_dto_1.CreateCouponDto !== "undefined" && coupon_dto_1.CreateCouponDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'List coupons' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof coupon_dto_1.CouponQueryDto !== "undefined" && coupon_dto_1.CouponQueryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coupon by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update coupon' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof coupon_dto_1.UpdateCouponDto !== "undefined" && coupon_dto_1.UpdateCouponDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete coupon' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF', 'MEMBER'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate a coupon code without applying' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof coupon_dto_1.ValidateCouponDto !== "undefined" && coupon_dto_1.ValidateCouponDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)('apply'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF', 'MEMBER'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate coupon discount (usage recorded during order creation)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof coupon_dto_1.ApplyCouponDto !== "undefined" && coupon_dto_1.ApplyCouponDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "apply", null);
__decorate([
    (0, common_1.Get)('stats/performance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coupon performance stats (usage, discount, top coupons)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "getPerformanceStats", null);
__decorate([
    (0, common_1.Get)(':id/usages'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coupon usage report' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "getUsageReport", null);
exports.CouponController = CouponController = __decorate([
    (0, swagger_1.ApiTags)('Coupons'),
    (0, common_1.Controller)('coupons'),
    __metadata("design:paramtypes", [typeof (_a = typeof coupon_service_1.CouponService !== "undefined" && coupon_service_1.CouponService) === "function" ? _a : Object])
], CouponController);


/***/ }),
/* 159 */
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
exports.ApplyCouponDto = exports.ValidateCouponDto = exports.CouponQueryDto = exports.UpdateCouponDto = exports.CreateCouponDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
class CreateCouponDto {
    code;
    type;
    value;
    minAmount;
    maxDiscount;
    maxUsage;
    maxUsagePerMember;
    description;
    startDate;
    endDate;
    status;
    tenantId;
}
exports.CreateCouponDto = CreateCouponDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['PERCENTAGE', 'FIXED'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "minAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "maxDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "maxUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "maxUsagePerMember", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "tenantId", void 0);
class UpdateCouponDto {
    code;
    type;
    value;
    minAmount;
    maxDiscount;
    maxUsage;
    maxUsagePerMember;
    description;
    startDate;
    endDate;
    status;
}
exports.UpdateCouponDto = UpdateCouponDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCouponDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCouponDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCouponDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCouponDto.prototype, "minAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCouponDto.prototype, "maxDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCouponDto.prototype, "maxUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCouponDto.prototype, "maxUsagePerMember", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCouponDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCouponDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCouponDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCouponDto.prototype, "status", void 0);
class CouponQueryDto {
    tenantId;
    page;
    limit;
    status;
    search;
    sort;
}
exports.CouponQueryDto = CouponQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CouponQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CouponQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CouponQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CouponQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CouponQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CouponQueryDto.prototype, "sort", void 0);
class ValidateCouponDto {
    code;
    memberId;
    orderTotal;
    tenantId;
}
exports.ValidateCouponDto = ValidateCouponDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateCouponDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateCouponDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ValidateCouponDto.prototype, "orderTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateCouponDto.prototype, "tenantId", void 0);
class ApplyCouponDto {
    code;
    memberId;
    orderTotal;
    tenantId;
}
exports.ApplyCouponDto = ApplyCouponDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplyCouponDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplyCouponDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ApplyCouponDto.prototype, "orderTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplyCouponDto.prototype, "tenantId", void 0);


/***/ }),
/* 160 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocketModule = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(11);
const websocket_gateway_1 = __webpack_require__(151);
const websocket_event_service_1 = __webpack_require__(154);
const websocket_event_controller_1 = __webpack_require__(161);
const prisma_module_1 = __webpack_require__(15);
let WebSocketModule = class WebSocketModule {
};
exports.WebSocketModule = WebSocketModule;
exports.WebSocketModule = WebSocketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'loyalty-platform-secret-key',
                signOptions: { expiresIn: '7d' },
            }),
        ],
        controllers: [websocket_event_controller_1.WebSocketEventController],
        providers: [websocket_gateway_1.WebSocketGatewayImpl, websocket_event_service_1.WebSocketEventService],
        exports: [websocket_gateway_1.WebSocketGatewayImpl, websocket_event_service_1.WebSocketEventService],
    })
], WebSocketModule);


/***/ }),
/* 161 */
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
exports.WebSocketEventController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const websocket_event_service_1 = __webpack_require__(154);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
let WebSocketEventController = class WebSocketEventController {
    eventService;
    constructor(eventService) {
        this.eventService = eventService;
    }
    getRecent(limit) {
        return this.eventService.getRecent(limit || 50);
    }
    replay(room, memberId, since, limit) {
        return this.eventService.replay(room, memberId, since, limit || 50);
    }
};
exports.WebSocketEventController = WebSocketEventController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent WebSocket events' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WebSocketEventController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)('replay'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Replay WebSocket events by room or member' }),
    __param(0, (0, common_1.Query)('room')),
    __param(1, (0, common_1.Query)('memberId')),
    __param(2, (0, common_1.Query)('since')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", void 0)
], WebSocketEventController.prototype, "replay", null);
exports.WebSocketEventController = WebSocketEventController = __decorate([
    (0, swagger_1.ApiTags)('WebSocket Events'),
    (0, common_1.Controller)('ws-events'),
    __metadata("design:paramtypes", [typeof (_a = typeof websocket_event_service_1.WebSocketEventService !== "undefined" && websocket_event_service_1.WebSocketEventService) === "function" ? _a : Object])
], WebSocketEventController);


/***/ }),
/* 162 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberSegmentationModule = void 0;
const common_1 = __webpack_require__(2);
const member_segmentation_controller_1 = __webpack_require__(163);
const member_segmentation_service_1 = __webpack_require__(164);
const common_module_1 = __webpack_require__(46);
const export_module_1 = __webpack_require__(105);
let MemberSegmentationModule = class MemberSegmentationModule {
};
exports.MemberSegmentationModule = MemberSegmentationModule;
exports.MemberSegmentationModule = MemberSegmentationModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule, export_module_1.ExportModule],
        controllers: [member_segmentation_controller_1.MemberSegmentationController],
        providers: [member_segmentation_service_1.MemberSegmentationService],
        exports: [member_segmentation_service_1.MemberSegmentationService],
    })
], MemberSegmentationModule);


/***/ }),
/* 163 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberSegmentationController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const member_segmentation_service_1 = __webpack_require__(164);
const jwt_auth_guard_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(9);
const member_segmentation_dto_1 = __webpack_require__(165);
const export_service_1 = __webpack_require__(107);
let MemberSegmentationController = class MemberSegmentationController {
    service;
    exportService;
    constructor(service, exportService) {
        this.service = service;
        this.exportService = exportService;
    }
    findAll(req, query) {
        return this.service.findAll({
            tenantId: req.tenantId ?? query.tenantId,
            page: query.page,
            limit: query.limit,
            segment: query.segment,
            sort: query.sort,
            search: query.search,
        });
    }
    getSummary(tenantId) {
        return this.service.getSegmentSummary({ tenantId });
    }
    async exportCsv(req, query, res) {
        const { data } = await this.service.findAll({ ...query, tenantId: req.tenantId ?? query.tenantId });
        const columns = [
            { key: 'fullName', label: 'Full Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'segment', label: 'Segment' },
            { key: 'totalScore', label: 'RFM Score' },
            { key: 'recency', label: 'Recency Score' },
            { key: 'frequency', label: 'Frequency Score' },
            { key: 'monetary', label: 'Monetary Score' },
            { key: 'orderCount', label: 'Order Count' },
            { key: 'totalSpend', label: 'Total Spend' },
            { key: 'daysSinceLastOrder', label: 'Days Since Last Order' },
            { key: 'availablePoints', label: 'Available Points' },
        ];
        const flat = data.map((m) => ({
            fullName: m.fullName, email: m.email, phone: m.phone || '',
            segment: m.segment,
            totalScore: m.rfm.totalScore, recency: m.rfm.recency,
            frequency: m.rfm.frequency, monetary: m.rfm.monetary,
            orderCount: m.orderCount, totalSpend: m.totalSpend,
            daysSinceLastOrder: m.daysSinceLastOrder === 999 ? 'Never' : m.daysSinceLastOrder,
            availablePoints: m.availablePoints,
        }));
        const csv = this.exportService.toCsv(flat, columns);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="rfm_segmentation_${Date.now()}.csv"`);
        return res.send(csv);
    }
    findOne(memberId) {
        return this.service.computeRFM(memberId);
    }
};
exports.MemberSegmentationController = MemberSegmentationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'List all members with RFM scores and segments' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof member_segmentation_dto_1.SegmentationQueryDto !== "undefined" && member_segmentation_dto_1.SegmentationQueryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], MemberSegmentationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get segment summary with counts and aggregates' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberSegmentationController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Export RFM segmentation data as CSV' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof member_segmentation_dto_1.SegmentationQueryDto !== "undefined" && member_segmentation_dto_1.SegmentationQueryDto) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", Promise)
], MemberSegmentationController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)(':memberId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('HOST', 'ADMIN', 'STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Get RFM analysis for a specific member' }),
    __param(0, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MemberSegmentationController.prototype, "findOne", null);
exports.MemberSegmentationController = MemberSegmentationController = __decorate([
    (0, swagger_1.ApiTags)('Member Segmentation'),
    (0, common_1.Controller)('member-segmentation'),
    __metadata("design:paramtypes", [typeof (_a = typeof member_segmentation_service_1.MemberSegmentationService !== "undefined" && member_segmentation_service_1.MemberSegmentationService) === "function" ? _a : Object, typeof (_b = typeof export_service_1.ExportService !== "undefined" && export_service_1.ExportService) === "function" ? _b : Object])
], MemberSegmentationController);


/***/ }),
/* 164 */
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
exports.MemberSegmentationService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(16);
const sort_util_1 = __webpack_require__(30);
const RECENCY_SCORES = [
    { max: 7, score: 5 },
    { max: 30, score: 4 },
    { max: 60, score: 3 },
    { max: 90, score: 2 },
    { max: Infinity, score: 1 },
];
const FREQUENCY_SCORES = [
    { min: 10, score: 5 },
    { min: 5, score: 4 },
    { min: 3, score: 3 },
    { min: 2, score: 2 },
    { min: 0, score: 1 },
];
const MONETARY_SCORES = [
    { min: 10000000, score: 5 },
    { min: 5000000, score: 4 },
    { min: 1000000, score: 3 },
    { min: 500000, score: 2 },
    { min: 0, score: 1 },
];
const SEGMENTS = [
    { label: 'Champions', minScore: 13, description: 'Best customers — high recency, frequency, and spend', color: '#7c3aed' },
    { label: 'Loyal Customers', minScore: 10, description: 'Regular purchasers with consistent spend', color: '#2563eb' },
    { label: 'Potential Loyalists', minScore: 7, description: 'Recent buyers with moderate frequency', color: '#0891b2' },
    { label: 'New Customers', minScore: 5, description: 'Recent but low frequency', color: '#16a34a' },
    { label: 'At Risk', minScore: 3, description: 'Used to purchase but haven\'t recently', color: '#d97706' },
    { label: 'Lost', minScore: 0, description: 'No recent activity, low spend', color: '#dc2626' },
];
function scoreRecency(days) {
    for (const s of RECENCY_SCORES) {
        if (days <= s.max)
            return s.score;
    }
    return 1;
}
function scoreFrequency(count) {
    for (const s of FREQUENCY_SCORES) {
        if (count >= s.min)
            return s.score;
    }
    return 1;
}
function scoreMonetary(total) {
    for (const s of MONETARY_SCORES) {
        if (total >= s.min)
            return s.score;
    }
    return 1;
}
function assignSegment(rfmScore) {
    for (const s of SEGMENTS) {
        if (rfmScore >= s.minScore)
            return s;
    }
    return SEGMENTS[SEGMENTS.length - 1];
}
let MemberSegmentationService = class MemberSegmentationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async computeRFM(memberId) {
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
            include: { orders: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });
        if (!member)
            return null;
        const now = new Date();
        const lastOrder = member.orders[0];
        const daysSinceLastOrder = lastOrder
            ? Math.floor((now.getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24))
            : 999;
        const aggregate = await this.prisma.order.aggregate({
            where: { memberId, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
            _count: { id: true },
            _sum: { total: true },
        });
        const orderCount = aggregate._count.id;
        const totalSpend = aggregate._sum.total || 0;
        const r = scoreRecency(daysSinceLastOrder);
        const f = scoreFrequency(orderCount);
        const m = scoreMonetary(totalSpend);
        const rfmScore = r + f + m;
        const segment = assignSegment(rfmScore);
        return {
            memberId,
            fullName: member.fullName,
            email: member.email,
            rfm: { recency: r, frequency: f, monetary: m, totalScore: rfmScore },
            daysSinceLastOrder,
            orderCount,
            totalSpend,
            segment: segment.label,
            segmentDescription: segment.description,
            segmentColor: segment.color,
        };
    }
    async findAll(params) {
        const { tenantId, page = 1, limit = 20, segment, sort, search } = params;
        const memberWhere = {};
        if (tenantId)
            memberWhere.tenantId = tenantId;
        if (search) {
            memberWhere.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        const members = await this.prisma.member.findMany({
            where: memberWhere,
            include: {
                tier: true,
                orders: { orderBy: { createdAt: 'desc' }, take: 1 },
                _count: { select: { orders: { where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } } } } },
            },
        });
        const now = new Date();
        let results = await Promise.all(members.map(async (member) => {
            const lastOrder = member.orders[0];
            const daysSinceLastOrder = lastOrder
                ? Math.floor((now.getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24))
                : 999;
            const aggregate = await this.prisma.order.aggregate({
                where: { memberId: member.id, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
                _sum: { total: true },
            });
            const orderCount = member._count.orders;
            const totalSpend = aggregate._sum.total || 0;
            const r = scoreRecency(daysSinceLastOrder);
            const f = scoreFrequency(orderCount);
            const m = scoreMonetary(totalSpend);
            const rfmScore = r + f + m;
            const segmentInfo = assignSegment(rfmScore);
            return {
                memberId: member.id,
                fullName: member.fullName,
                email: member.email,
                phone: member.phone,
                avatar: member.avatar,
                tier: member.tier,
                status: member.status,
                totalPoints: member.totalPoints,
                availablePoints: member.availablePoints,
                createdAt: member.createdAt,
                rfm: { recency: r, frequency: f, monetary: m, totalScore: rfmScore },
                daysSinceLastOrder,
                orderCount,
                totalSpend,
                segment: segmentInfo.label,
                segmentDescription: segmentInfo.description,
                segmentColor: segmentInfo.color,
            };
        }));
        if (segment) {
            results = results.filter((r) => r.segment === segment);
        }
        const { orderBy, orderDirection } = (0, sort_util_1.parseSort)(sort || 'rfmScore_desc');
        results.sort((a, b) => {
            let cmp = 0;
            if (orderBy === 'rfmScore')
                cmp = a.rfm.totalScore - b.rfm.totalScore;
            else if (orderBy === 'fullName')
                cmp = a.fullName.localeCompare(b.fullName);
            else if (orderBy === 'totalSpend')
                cmp = a.totalSpend - b.totalSpend;
            else if (orderBy === 'orderCount')
                cmp = a.orderCount - b.orderCount;
            else if (orderBy === 'daysSinceLastOrder')
                cmp = a.daysSinceLastOrder - b.daysSinceLastOrder;
            else
                cmp = a.rfm.totalScore - b.rfm.totalScore;
            return orderDirection === 'desc' ? -cmp : cmp;
        });
        const total = results.length;
        const start = (page - 1) * limit;
        const data = results.slice(start, start + limit);
        return {
            data,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getSegmentSummary(params) {
        const { tenantId } = params;
        const memberWhere = {};
        if (tenantId)
            memberWhere.tenantId = tenantId;
        const members = await this.prisma.member.findMany({
            where: memberWhere,
            include: {
                orders: { orderBy: { createdAt: 'desc' }, take: 1 },
                _count: { select: { orders: { where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } } } } },
            },
        });
        const now = new Date();
        const segmentCounts = {};
        for (const member of members) {
            const lastOrder = member.orders[0];
            const daysSinceLastOrder = lastOrder
                ? Math.floor((now.getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24))
                : 999;
            const aggregate = await this.prisma.order.aggregate({
                where: { memberId: member.id, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
                _sum: { total: true },
            });
            const orderCount = member._count.orders;
            const totalSpend = aggregate._sum.total || 0;
            const r = scoreRecency(daysSinceLastOrder);
            const f = scoreFrequency(orderCount);
            const m = scoreMonetary(totalSpend);
            const rfmScore = r + f + m;
            const segmentInfo = assignSegment(rfmScore);
            if (!segmentCounts[segmentInfo.label]) {
                segmentCounts[segmentInfo.label] = { count: 0, totalSpend: 0, totalPoints: 0 };
            }
            segmentCounts[segmentInfo.label].count++;
            segmentCounts[segmentInfo.label].totalSpend += totalSpend;
            segmentCounts[segmentInfo.label].totalPoints += member.totalPoints;
        }
        const summary = SEGMENTS.map((s) => ({
            label: s.label,
            description: s.description,
            color: s.color,
            minScore: s.minScore,
            count: segmentCounts[s.label]?.count || 0,
            totalSpend: segmentCounts[s.label]?.totalSpend || 0,
            totalPoints: segmentCounts[s.label]?.totalPoints || 0,
        }));
        return { summary, totalMembers: members.length };
    }
};
exports.MemberSegmentationService = MemberSegmentationService;
exports.MemberSegmentationService = MemberSegmentationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MemberSegmentationService);


/***/ }),
/* 165 */
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
exports.SegmentationQueryDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(3);
class SegmentationQueryDto {
    tenantId;
    page;
    limit;
    segment;
    sort;
    search;
}
exports.SegmentationQueryDto = SegmentationQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SegmentationQueryDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SegmentationQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SegmentationQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SegmentationQueryDto.prototype, "segment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SegmentationQueryDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SegmentationQueryDto.prototype, "search", void 0);


/***/ }),
/* 166 */
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
            message: Array.isArray(message) ? message.join('; ') : message,
            data: null,
            errors: Array.isArray(message) ? message : [message],
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);


/***/ }),
/* 167 */
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
const rxjs_1 = __webpack_require__(168);
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
/* 168 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 169 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransformInterceptor = void 0;
const common_1 = __webpack_require__(2);
const rxjs_1 = __webpack_require__(168);
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, rxjs_1.map)(result => {
            const payload = {
                success: true,
                message: 'Success',
                data: result,
                errors: [],
            };
            if (result &&
                typeof result === 'object' &&
                'data' in result &&
                'total' in result &&
                'page' in result &&
                'limit' in result &&
                'totalPages' in result) {
                payload.data = result.data;
                payload.pagination = {
                    page: result.page,
                    size: result.limit,
                    totalItems: result.total,
                    totalPages: result.totalPages,
                };
            }
            return payload;
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);


/***/ }),
/* 170 */
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
exports.AuditLogInterceptor = void 0;
const common_1 = __webpack_require__(2);
const rxjs_1 = __webpack_require__(168);
const prisma_service_1 = __webpack_require__(16);
const ENTITY_MODEL_MAP = {
    tenants: 'tenant',
    users: 'user',
    members: 'member',
    tiers: 'tier',
    campaigns: 'campaign',
    rewards: 'reward',
    vouchers: 'voucher',
    promotions: 'promotion',
    referrals: 'referral',
    badges: 'badge',
    missions: 'mission',
    'notification-templates': 'notificationTemplate',
    'member-vouchers': 'memberVoucher',
};
let AuditLogInterceptor = class AuditLogInterceptor {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip } = request;
        const user = request.user;
        if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            return next.handle();
        }
        const entityMatch = url.match(/\/api\/v1\/(\w+(?:-\w+)*)/);
        const entityType = entityMatch ? entityMatch[1] : 'unknown';
        const entityId = request.params?.id;
        const modelName = ENTITY_MODEL_MAP[entityType];
        const prisma = this.prisma;
        async function fetchOldValue() {
            if (!entityId || !modelName || method === 'POST')
                return null;
            try {
                const model = prisma[modelName];
                if (model?.findUnique) {
                    return await model.findUnique({ where: { id: entityId } });
                }
            }
            catch { }
            return null;
        }
        return (0, rxjs_1.from)(fetchOldValue()).pipe((0, rxjs_1.switchMap)((oldValue) => next.handle().pipe((0, rxjs_1.tap)((responseBody) => {
            const finalEntityId = entityId || responseBody?.id || 'unknown';
            this.prisma.auditLog.create({
                data: {
                    entityType,
                    entityId: finalEntityId,
                    action: method === 'POST' ? 'CREATE' : method === 'DELETE' ? 'DELETE' : 'UPDATE',
                    userId: user?.id || user?.sub || null,
                    userEmail: user?.email || null,
                    oldValue: method !== 'POST' && oldValue ? oldValue : null,
                    newValue: method !== 'DELETE' ? responseBody : null,
                    ipAddress: ip,
                },
            }).catch(() => { });
        }))));
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AuditLogInterceptor);


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
const global_exception_filter_1 = __webpack_require__(166);
const logging_interceptor_1 = __webpack_require__(167);
const transform_interceptor_1 = __webpack_require__(169);
const audit_log_interceptor_1 = __webpack_require__(170);
const prisma_service_1 = __webpack_require__(16);
async function bootstrap() {
    const logger = new common_1.Logger('ApiGateway');
    const app = await core_1.NestFactory.create(api_gateway_module_1.ApiGatewayModule);
    app.setGlobalPrefix('api/v1');
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new transform_interceptor_1.TransformInterceptor(), new audit_log_interceptor_1.AuditLogInterceptor(app.get(prisma_service_1.PrismaService)));
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