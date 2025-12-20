<div class="route-bg">
    <slot></slot>
</div>

<style>
    .route-bg {
        height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        /* 用 radial-gradient 叠加实现两个角的扩散渐隐 */
        background: radial-gradient(
                circle at 0% 0%,
                /* 左上角 */ rgba(0, 120, 255, 0.55) 0%,
                /* 蓝色起始（可调透明度） */ rgba(0, 120, 255, 0.35) 20%,
                rgba(0, 120, 255, 0.15) 35%,
                transparent 55% /* 渐隐到透明的比例（可调） */
            ),
            radial-gradient(
                circle at 100% 100%,
                /* 右下角 */ rgba(255, 0, 0, 0.55) 0%,
                /* 红色起始（可调透明度） */ rgba(255, 0, 0, 0.35) 20%,
                rgba(255, 0, 0, 0.15) 35%,
                transparent 55%
            );

        background-repeat: no-repeat;
        background-attachment: fixed;
    }
</style>
