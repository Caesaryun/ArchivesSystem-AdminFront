import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
/**
 *  配置滚动条的位置
 *  通过这个这个属性（是个函数），可以让应用像浏览器的原生表现那样，在按下 后退/前进 按钮时，简单地让页面滚动到顶部或原来的位置。
 */
const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
        return savedPosition
    } else {
        return {x: 0, y: 0}
    }
}
/**
 *  路由配置
 *  @mode: 配置路由模式（"hash" | "history" | "abstract"）
 *  @base: 如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"。
 *  @linkActiveClass: 点击触发的class
 *  @scrollBehavior: 配置滚动条的位置
 */
const router = new VueRouter({
    // mode: 'history',
    base: __dirname,
    likActiveClass: 'link-active',
    scrollBehavior,
    routes: [
        {
            path: '/',
            redirect: '/login'
        }, {
            path: '/login',
            component: resolve => require.ensure([], () => resolve(require('@/components/page/login')), 'login'),
            meta: {title: '登录'},
        },
        {
            path: '/qrcode_login',
            component: resolve => require.ensure([], () => resolve(require('../views/qrcode_login.vue')), 'qrcode_login'),
            meta: {title: '扫码登录'},
        },
         {
            path: '*',
            component: resolve => require.ensure([], () => resolve(require('@/components/page/404')), 'error'),
            meta: {title: '404'},
        }, {
            path: '/',
            component: resolve => require.ensure([], () => resolve(require('@/components/layout/init')), 'home'),
            meta: {title: '初始化组件'},
            children: [
                {
                    path: '/home',
                    component: resolve => require(['../components/page/home.vue'], resolve),
                    meta: {
                        title: '系统首页',
                        requireAuth:true //表示需要登陆后才能查看
                     }
                }, {
                    path: '/403',
                    component: resolve => require.ensure([], () => resolve(require('@/components/page/403')), 'error'),
                    meta: {title: '403',
                     requireAuth:true 
                    }, 
                },
                {
                    path: '/test',
                    component: resolve => require(['../components/page/Test.vue'], resolve),
                    meta: {title: 'Test', requireAuth:true 
                },
                },
                {
                    path: '/archsmain',
                    component: resolve => require(['../views/Archsmain.vue'], resolve),
                    meta: {title: '系统主页', requireAuth:true },
                },
                {
                    path: '/department',
                    component: resolve => require(['../views/Department.vue'], resolve),
                    meta: {title: '部门管理', requireAuth:true },
                },
                {
                    path: '/adminlist',
                    component: resolve => require(['../views/adminlist.vue'], resolve),
                    meta: {title: '管理员列表', requireAuth:true },
                },
                {
                    path: '/commonlist',
                    component: resolve => require(['../views/commonlist.vue'], resolve),
                    meta: {title: '普通用户列表', requireAuth:true },
                },
                {
                    path: '/arch_docu',
                    component: resolve => require(['../views/Arch_docu.vue'], resolve),
                    meta: {title: '文本档案', requireAuth:true 
                    },
                },
                {
                    path: '/arch_search',
                    component: resolve => require(['../views/Arch_show.vue'], resolve),
                    meta: {
                        title: '档案检索'
                    },
                },
                {
                    path: '/arch_detail',
                    component: resolve => require(['../views/Arch_detail.vue'], resolve),
                    meta: {title: '档案详情', requireAuth:true },
                },
                {
                    path: '/arch_apply',
                    component: resolve => require(['../views/Arch_apply.vue'], resolve),
                    meta: {title: '归档材料审核', requireAuth:true },
                },
                {
                    path: '/arch_check_file',
                    component: resolve => require(['../views/Arch_check_file.vue'], resolve),
                    meta: {title: '审核归档材料', requireAuth:true },
                },
                {
                    path: '/arch_check_arch',
                    component: resolve => require(['../views/Arch_check_arch.vue'], resolve),
                    meta: {title: '档案审核', requireAuth:true },
                },
                {
                    path: '/arch_check_arch_feedback',
                    component: resolve => require(['../views/part_time_admin/arch_check_arch_feedback.vue'], resolve),
                    meta: {title: '档案审核反馈', requireAuth:true },
                },
                {
                    path: '/arch_check_borrow',
                    component: resolve => require(['../views/part_time_admin/arch_check_borrow.vue'], resolve),
                    meta: {title: '借阅审核', requireAuth:true },
                },
                {
                    path: '/arch_return_back',
                    component: resolve => require(['../views/part_time_admin/arch_return_back.vue'], resolve),
                    meta: {title: '档案归还处理', requireAuth:true },
                }
                ,
                {
                    path: '/arch_down_templete',
                    component: resolve => require(['../views/part_time_admin/arch_down_templete.vue'], resolve),
                    meta: {title: '导入模板管理', requireAuth:true },
                }
                ,
                {
                    path: '/arch_add_templete',
                    component: resolve => require(['../views/part_time_admin/arch_add_template.vue'], resolve),
                    meta: {title: '添加模板', requireAuth:true },
                },
                {
                    path: '/arch_role',
                    component: resolve => require(['../views/part_time_admin/arch_role.vue'], resolve),
                    meta: {title: '角色管理', requireAuth:true },
                },
                {
                    path: '/arch_backups',
                    component: resolve => require(['../views/arch_backups.vue'], resolve),
                    meta: {title: '备份数据', requireAuth:true },
                },
                {
                    path: '/arch_recovery',
                    component: resolve => require(['../views/arch_recovery.vue'], resolve),
                    meta: {title: '恢复数据', requireAuth:true },
                },
                {
                    path: '/arch_create_index',
                    component: resolve => require(['../views/part_time_admin/arch_create_index.vue'], resolve),
                    meta: {title: '建立索引', requireAuth:true },
                },
                {
                    path: '/arch_contact',
                    component: resolve => require(['../views/part_time_admin/arch_contact.vue'], resolve),
                    meta: {title: '交流中心', requireAuth:true },
                },
                {
                    path: '/arch_count',
                    component: resolve => require(['../views/part_time_admin/arch_count.vue'], resolve),
                    meta: {title: '数据统计', requireAuth:true },
                },
                {
                    path: '/arch_talk',
                    component: resolve => require(['../views/part_time_admin/arch_talk.vue'], resolve),
                    meta: {title: '联系', requireAuth:true },
                },


            ]
        }
    ]
})
/**
 *  修改网站title的值
 */
router.afterEach((transition) => {
    if (transition.meta.title) {
        document.title = transition.meta.title
    }
})


/**
 * 路由拦截器
 * 用钩子函数对路由进行权限跳转
 * 1.判断该路由是否需要登录权限
 * 2.通过vuex state获取当前的token是否存在
 * 3.将跳转的路由path作为参数，登录成功后跳转到该路由
 */
// router.beforeEach((to, from, next) => {
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// })
/**
 * 路由输出
 */
export default router
