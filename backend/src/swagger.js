export const swaggerDoc = {
  openapi: '3.0.0',
  info: {
    title: 'Lotto Key System API',
    description: 'Lotto Key System API - Hono + Prisma ORM + SQLite',
    version: '2.0.0',
  },
  servers: [{ url: 'http://localhost:3001/api', description: 'Development server' }],
  tags: [
    { name: 'Authentication', description: 'Auth endpoints (login/register/profile/logout)' },
    { name: 'Transactions', description: 'รายการแทงหวย' },
    { name: 'Settings', description: 'ตั้งค่าระบบ (อัตราจ่าย, เปิด/ปิด)' },
    { name: 'Restricted Numbers', description: 'หวยอั้น' },
    { name: 'Bet Types', description: 'ประเภทหวย (2ตัว/3ตัว/พิเศษ)' },
    { name: 'Summary', description: 'สรุปยอด' },
    { name: 'Users', description: 'จัดการผู้ใช้' },
    { name: 'Customers', description: 'จัดการลูกค้า' },
    { name: 'Products', description: 'Product management' },
    { name: 'Coupons', description: 'Coupon management' },
    { name: 'Purchases', description: 'Purchase management' },
    { name: 'Purchase Limits', description: 'Purchase limit management' },
    { name: 'Percent Allocations', description: 'Percent allocation management' },
    { name: 'Restricted Products', description: 'Restricted product management' },
    { name: 'User Coupons', description: 'User coupon management' },
    { name: 'Keep ID', description: 'Keep ID management' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
      },
    },
    schemas: {
      // ===== Common =====
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          message: { type: 'string' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },

      // ===== Auth =====
      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'admin01' },
          password: { type: 'string', example: '1234' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'newuser' },
          password: { type: 'string', example: '1234' },
          role: { type: 'string', enum: ['admin', 'agent', 'customer'], example: 'customer' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
        },
      },

      // ===== Transaction =====
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          betTypeCode: { type: 'string', example: 'song_bon' },
          betTypeLabel: { type: 'string', example: 'สองตัวบน' },
          number: { type: 'string', example: '45' },
          amount: { type: 'number', example: 100 },
          customerId: { type: 'integer', nullable: true },
          customerName: { type: 'string', example: 'ลูกค้าทั่วไป' },
          userId: { type: 'integer', nullable: true },
          userName: { type: 'string', example: 'ADMIN' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateTransactionRequest: {
        type: 'object',
        required: ['number', 'amount'],
        properties: {
          bet_type_code: { type: 'string', example: 'song_bon' },
          bet_type_label: { type: 'string', example: 'สองตัวบน' },
          number: { type: 'string', example: '45' },
          amount: { type: 'number', example: 100 },
          customer_id: { type: 'integer', example: null },
          customer_name: { type: 'string', example: 'ลูกค้าทั่วไป' },
          user_id: { type: 'integer', example: null },
          user_name: { type: 'string', example: 'ADMIN' },
        },
      },

      // ===== Settings =====
      Settings: {
        type: 'object',
        properties: {
          payRate2Digit: { type: 'number', example: 95 },
          payRate3Digit: { type: 'number', example: 900 },
          isLotteryOpen: { type: 'boolean', example: true },
          closingTime: { type: 'string', example: '14:30' },
          minBet: { type: 'number', example: 1 },
          maxBet2Digit: { type: 'number', example: 1000 },
          maxBet3Digit: { type: 'number', example: 500 },
          autoReverse: { type: 'boolean', example: false },
          payRates: {
            type: 'object',
            properties: {
              song_bon: { type: 'number', example: 95 },
              song_kang: { type: 'number', example: 95 },
              song_bon_lang: { type: 'number', example: 95 },
              ek_3song: { type: 'number', example: 900 },
              tode_3: { type: 'number', example: 150 },
              tode_yai: { type: 'number', example: 450 },
              tode_lek: { type: 'number', example: 150 },
              wing_bon: { type: 'number', example: 3.2 },
              wing_lang: { type: 'number', example: 4.2 },
            },
          },
          restrictedNumbers: {
            type: 'array',
            items: { $ref: '#/components/schemas/RestrictedNumber' },
          },
        },
      },
      UpdateSettingsRequest: {
        type: 'object',
        properties: {
          isLotteryOpen: { type: 'boolean' },
          closingTime: { type: 'string' },
          minBet: { type: 'number' },
          maxBet2Digit: { type: 'number' },
          maxBet3Digit: { type: 'number' },
          autoReverse: { type: 'boolean' },
          payRates: {
            type: 'object',
            properties: {
              song_bon: { type: 'number' },
              song_kang: { type: 'number' },
            },
          },
        },
      },

      // ===== Restricted Number =====
      RestrictedNumber: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          number: { type: 'string', example: '89' },
          maxAmount: { type: 'integer', example: 200 },
          type: { type: 'string', example: '2ตัว' },
        },
      },
      CreateRestrictedNumberRequest: {
        type: 'object',
        required: ['number'],
        properties: {
          number: { type: 'string', example: '89' },
          maxAmount: { type: 'integer', example: 200 },
          type: { type: 'string', enum: ['2ตัว', '3ตัว'], example: '2ตัว' },
        },
      },
      RestrictedCheckResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          restricted: { type: 'boolean' },
          data: {
            type: 'object',
            nullable: true,
            properties: {
              number: { type: 'string' },
              maxAmount: { type: 'integer' },
              type: { type: 'string' },
            },
          },
        },
      },

      // ===== Bet Type =====
      BetType: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          key: { type: 'string', example: 'W' },
          code: { type: 'string', example: 'song_bon' },
          label: { type: 'string', example: 'สองตัวบน' },
          shortcut: { type: 'string', example: 'W' },
          category: { type: 'string', enum: ['2digit', '3digit', 'special'] },
          sortOrder: { type: 'integer' },
        },
      },
      BetTypesResponse: {
        type: 'object',
        properties: {
          digit2: { type: 'array', items: { $ref: '#/components/schemas/BetType' } },
          digit3: { type: 'array', items: { $ref: '#/components/schemas/BetType' } },
          special: { type: 'array', items: { $ref: '#/components/schemas/BetType' } },
        },
      },

      // ===== Summary =====
      Summary: {
        type: 'object',
        properties: {
          totalBills: { type: 'integer', example: 15 },
          totalAmount: { type: 'number', example: 2430 },
          totalCustomers: { type: 'integer', example: 8 },
          topNumbers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                number: { type: 'string', example: '45' },
                total: { type: 'number', example: 350 },
              },
            },
          },
        },
      },

      // ===== User =====
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'agent', 'customer'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'agent', 'customer'] },
        },
      },

      // ===== Customer =====
      Customer: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          phone: { type: 'string' },
          status: { type: 'string', enum: ['active', 'inactive'] },
          balance: { type: 'number' },
          percentage: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateCustomerRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'คุณสมชาย' },
          phone: { type: 'string', example: '081-111-1111' },
          status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
          balance: { type: 'number', example: 5000 },
          percentage: { type: 'number', example: 5 },
        },
      },

      // ===== Product =====
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          stock: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateProductRequest: {
        type: 'object',
        required: ['name', 'stock'],
        properties: {
          name: { type: 'string', example: 'Product 1' },
          stock: { type: 'integer', example: 100 },
        },
      },

      // ===== Coupon =====
      Coupon: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          couponId: { type: 'string' },
          value: { type: 'number' },
          expiryDate: { type: 'string', format: 'date-time' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateCouponRequest: {
        type: 'object',
        required: ['coupon_id', 'value', 'expiry_date'],
        properties: {
          coupon_id: { type: 'string', example: 'SAVE20' },
          value: { type: 'number', example: 20 },
          expiry_date: { type: 'string', format: 'date', example: '2026-12-31' },
          status: { type: 'string', example: 'unused' },
        },
      },

      // ===== Purchase =====
      Purchase: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          totalAmount: { type: 'number' },
          percentageDiscount: { type: 'number' },
          couponId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreatePurchaseRequest: {
        type: 'object',
        required: ['total_amount', 'percentage', 'percentage_discount', 'products'],
        properties: {
          total_amount: { type: 'number', example: 10000 },
          percentage: { type: 'number', example: 10 },
          percentage_discount: { type: 'number', example: 1000 },
          coupon_id: { type: 'string', example: 'coupon-id-here' },
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product_id: { type: 'string' },
                quantity: { type: 'integer', example: 2 },
                price: { type: 'number', example: 5000 },
              },
            },
          },
        },
      },

      // ===== Purchase Limit =====
      PurchaseLimit: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          productId: { type: 'string' },
          maxQuantity: { type: 'integer' },
          budgetLimit: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreatePurchaseLimitRequest: {
        type: 'object',
        required: ['product_id', 'max_quantity', 'budget_limit'],
        properties: {
          product_id: { type: 'string' },
          max_quantity: { type: 'integer', example: 10 },
          budget_limit: { type: 'number', example: 10000.50 },
        },
      },

      // ===== Percent Allocation =====
      PercentAllocation: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          percentage: { type: 'number' },
          thresholdAmount: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreatePercentAllocationRequest: {
        type: 'object',
        required: ['user_id'],
        properties: {
          user_id: { type: 'string' },
          percentage: { type: 'number', example: 10 },
          threshold_amount: { type: 'number', example: 10000.50 },
        },
      },

      // ===== Restricted Product =====
      RestrictedProduct: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          customerId: { type: 'string' },
          productName: { type: 'string' },
          productCode: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateRestrictedProductRequest: {
        type: 'object',
        required: ['customer_id'],
        properties: {
          customer_id: { type: 'string' },
          product_name: { type: 'string', example: 'Product 1' },
          product_code: { type: 'string', example: 'P001' },
        },
      },

      // ===== User Coupon =====
      UserCoupon: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          couponId: { type: 'string' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateUserCouponRequest: {
        type: 'object',
        required: ['user_id', 'coupon_id'],
        properties: {
          user_id: { type: 'string' },
          coupon_id: { type: 'string' },
        },
      },

      // ===== Keep ID =====
      KeepId: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          customerId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateKeepIdRequest: {
        type: 'object',
        required: ['user_id', 'customer_id'],
        properties: {
          user_id: { type: 'string' },
          customer_id: { type: 'string' },
        },
      },
    },
  },
  paths: {
    // ==================== AUTH ====================
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login',
        description: 'Login with username and password. Sets httpOnly cookie.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: {
            description: 'Successful login',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } },
          },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register',
        description: 'Register a new user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
        },
        responses: {
          201: { description: 'User registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          400: { description: 'Bad request' },
        },
      },
    },
    '/auth/profile': {
      get: {
        tags: ['Authentication'],
        summary: 'Get profile',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // ==================== TRANSACTIONS ====================
    '/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'ดึงรายการแทงทั้งหมด',
        responses: {
          200: {
            description: 'List of transactions (DESC by id)',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } } } } } },
          },
        },
      },
      post: {
        tags: ['Transactions'],
        summary: 'เพิ่มรายการแทง',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTransactionRequest' } } },
        },
        responses: {
          201: { description: 'Created', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Transaction' } } } } } },
          400: { description: 'กรุณาใส่เลขและจำนวนเงิน' },
        },
      },
      delete: {
        tags: ['Transactions'],
        summary: 'ลบรายการทั้งหมด (clear)',
        responses: {
          200: { description: 'Cleared all transactions' },
        },
      },
    },
    '/transactions/{id}': {
      delete: {
        tags: ['Transactions'],
        summary: 'ลบรายการแทงตาม ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Deleted' },
          404: { description: 'ไม่พบรายการ' },
        },
      },
    },

    // ==================== SETTINGS ====================
    '/settings': {
      get: {
        tags: ['Settings'],
        summary: 'ดึงการตั้งค่าทั้งหมด',
        description: 'Returns all settings including payRates and restrictedNumbers',
        responses: {
          200: {
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Settings' } } } } },
          },
        },
      },
      put: {
        tags: ['Settings'],
        summary: 'อัพเดตการตั้งค่า',
        description: 'Upsert settings (supports nested payRates object)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateSettingsRequest' } } },
        },
        responses: {
          200: { description: 'Updated' },
        },
      },
    },

    // ==================== RESTRICTED NUMBERS ====================
    '/restricted': {
      get: {
        tags: ['Restricted Numbers'],
        summary: 'ดึงหวยอั้นทั้งหมด',
        responses: {
          200: {
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/RestrictedNumber' } } } } } },
          },
        },
      },
      post: {
        tags: ['Restricted Numbers'],
        summary: 'เพิ่มหวยอั้น',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateRestrictedNumberRequest' } } },
        },
        responses: {
          200: { description: 'Added - returns updated list' },
          400: { description: 'กรุณาใส่เลข' },
        },
      },
    },
    '/restricted/{number}': {
      delete: {
        tags: ['Restricted Numbers'],
        summary: 'ลบหวยอั้นตามเลข',
        parameters: [{ name: 'number', in: 'path', required: true, schema: { type: 'string' }, example: '89' }],
        responses: {
          200: { description: 'Deleted - returns updated list' },
        },
      },
    },
    '/restricted/check/{number}': {
      get: {
        tags: ['Restricted Numbers'],
        summary: 'ตรวจสอบว่าเลขอั้นหรือไม่',
        parameters: [{ name: 'number', in: 'path', required: true, schema: { type: 'string' }, example: '89' }],
        responses: {
          200: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RestrictedCheckResponse' } } },
          },
        },
      },
    },

    // ==================== BET TYPES ====================
    '/bet-types': {
      get: {
        tags: ['Bet Types'],
        summary: 'ดึงประเภทหวยทั้งหมด (แยก 2digit/3digit/special)',
        responses: {
          200: {
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/BetTypesResponse' } } } } },
          },
        },
      },
    },

    // ==================== SUMMARY ====================
    '/summary': {
      get: {
        tags: ['Summary'],
        summary: 'สรุปยอด (totalBills, totalAmount, topNumbers)',
        responses: {
          200: {
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Summary' } } } } },
          },
        },
      },
    },

    // ==================== USERS ====================
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } } } },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/User' } } } } } },
          404: { description: 'Not found' },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update user',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRequest' } } } },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },

    // ==================== CUSTOMERS (Public) ====================
    '/customers': {
      get: {
        tags: ['Customers'],
        summary: 'ดึงรายชื่อลูกค้าทั้งหมด (มี default ลูกค้าทั่วไป)',
        description: 'Public - ไม่ต้อง login. Prepends { id: 0, name: "-- ลูกค้าทั่วไป --" }',
        responses: {
          200: { content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Customer' } } } } } } },
        },
      },
      post: {
        tags: ['Customers'],
        summary: 'เพิ่มลูกค้า',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCustomerRequest' } } },
        },
        responses: {
          201: { description: 'Created', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Customer' } } } } } },
          400: { description: 'กรุณากรอกชื่อ' },
        },
      },
    },
    '/customers/{id}': {
      get: {
        tags: ['Customers'],
        summary: 'ดึงลูกค้าตาม ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Customer' } } } } } } },
      },
      patch: {
        tags: ['Customers'],
        summary: 'แก้ไขลูกค้า',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCustomerRequest' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Customers'],
        summary: 'ลบลูกค้า',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },

    // ==================== PRODUCTS ====================
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products',
        security: [{ cookieAuth: [] }],
        responses: { 200: { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } } },
      },
    },
    '/products/create': {
      post: {
        tags: ['Products'],
        summary: 'Create product',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProductRequest' } } } },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } } },
      },
      patch: {
        tags: ['Products'],
        summary: 'Update product',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProductRequest' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete product',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },

    // ==================== COUPONS ====================
    '/coupons': {
      get: {
        tags: ['Coupons'],
        summary: 'Get all coupons',
        security: [{ cookieAuth: [] }],
        responses: { 200: { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Coupon' } } } } } },
      },
    },
    '/coupons/create': {
      post: {
        tags: ['Coupons'],
        summary: 'Create coupon',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCouponRequest' } } } },
        responses: { 201: { description: 'Created' }, 409: { description: 'Coupon ID already exists' } },
      },
    },
    '/coupons/{id}': {
      get: {
        tags: ['Coupons'],
        summary: 'Get coupon by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Coupon' } } } } },
      },
      patch: {
        tags: ['Coupons'],
        summary: 'Update coupon',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCouponRequest' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Coupons'],
        summary: 'Delete coupon',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },

    // ==================== PURCHASES ====================
    '/purchases': {
      get: {
        tags: ['Purchases'],
        summary: 'Get all purchases',
        security: [{ cookieAuth: [] }],
        responses: { 200: { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Purchase' } } } } } },
      },
      post: {
        tags: ['Purchases'],
        summary: 'Create purchase',
        description: 'Create purchase with products, validates stock and limits',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePurchaseRequest' } } } },
        responses: { 201: { description: 'Created' }, 400: { description: 'Validation error' } },
      },
    },
    '/purchases/{id}': {
      get: {
        tags: ['Purchases'],
        summary: 'Get purchase by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Purchase' } } } } },
      },
    },

    // ==================== PURCHASE LIMITS ====================
    '/purchase-limits': {
      get: {
        tags: ['Purchase Limits'],
        summary: 'Get all purchase limits',
        security: [{ cookieAuth: [] }],
        responses: { 200: { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PurchaseLimit' } } } } } },
      },
    },
    '/purchase-limits/create': {
      post: {
        tags: ['Purchase Limits'],
        summary: 'Create purchase limit',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePurchaseLimitRequest' } } } },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/purchase-limits/{id}': {
      get: {
        tags: ['Purchase Limits'],
        summary: 'Get purchase limit by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/PurchaseLimit' } } } } },
      },
      patch: {
        tags: ['Purchase Limits'],
        summary: 'Update purchase limit',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePurchaseLimitRequest' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Purchase Limits'],
        summary: 'Delete purchase limit',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },

    // ==================== PERCENT ALLOCATIONS ====================
    '/percent-allocations': {
      get: {
        tags: ['Percent Allocations'],
        summary: 'Get all percent allocations',
        security: [{ cookieAuth: [] }],
        responses: { 200: { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PercentAllocation' } } } } } },
      },
    },
    '/percent-allocations/create': {
      post: {
        tags: ['Percent Allocations'],
        summary: 'Create percent allocation',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePercentAllocationRequest' } } } },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/percent-allocations/{id}': {
      get: {
        tags: ['Percent Allocations'],
        summary: 'Get percent allocation by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/PercentAllocation' } } } } },
      },
      patch: {
        tags: ['Percent Allocations'],
        summary: 'Update percent allocation',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePercentAllocationRequest' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Percent Allocations'],
        summary: 'Delete percent allocation',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },

    // ==================== RESTRICTED PRODUCTS ====================
    '/restricted-products': {
      get: {
        tags: ['Restricted Products'],
        summary: 'Get all restricted products',
        security: [{ cookieAuth: [] }],
        responses: { 200: { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/RestrictedProduct' } } } } } },
      },
    },
    '/restricted-products/create': {
      post: {
        tags: ['Restricted Products'],
        summary: 'Create restricted product',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateRestrictedProductRequest' } } } },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/restricted-products/{id}': {
      get: {
        tags: ['Restricted Products'],
        summary: 'Get restricted product by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RestrictedProduct' } } } } },
      },
      patch: {
        tags: ['Restricted Products'],
        summary: 'Update restricted product',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateRestrictedProductRequest' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Restricted Products'],
        summary: 'Delete restricted product',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },

    // ==================== USER COUPONS ====================
    '/user-coupons': {
      get: {
        tags: ['User Coupons'],
        summary: 'Get all user coupons',
        security: [{ cookieAuth: [] }],
        responses: { 200: { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/UserCoupon' } } } } } },
      },
    },
    '/user-coupons/create': {
      post: {
        tags: ['User Coupons'],
        summary: 'Create user coupon',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUserCouponRequest' } } } },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/user-coupons/{id}': {
      get: {
        tags: ['User Coupons'],
        summary: 'Get user coupon by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/UserCoupon' } } } } },
      },
      patch: {
        tags: ['User Coupons'],
        summary: 'Update user coupon',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUserCouponRequest' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['User Coupons'],
        summary: 'Delete user coupon',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },

    // ==================== KEEP ID ====================
    '/keep-id': {
      get: {
        tags: ['Keep ID'],
        summary: 'Get all keep IDs',
        security: [{ cookieAuth: [] }],
        responses: { 200: { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/KeepId' } } } } } },
      },
    },
    '/keep-id/create': {
      post: {
        tags: ['Keep ID'],
        summary: 'Create keep ID',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateKeepIdRequest' } } } },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/keep-id/{id}': {
      get: {
        tags: ['Keep ID'],
        summary: 'Get keep ID by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/KeepId' } } } } },
      },
      patch: {
        tags: ['Keep ID'],
        summary: 'Update keep ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateKeepIdRequest' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Keep ID'],
        summary: 'Delete keep ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
  },
};
