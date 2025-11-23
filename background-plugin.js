/**
 * Background Plugin JavaScript
 * 提供背景切換功能和API接口
 */

// 背景插件核心類
class BackgroundPlugin {
    constructor(options = {}) {
        this.options = {
            container: options.container || document.body,
            autoRotate: options.autoRotate !== false, // 默認啟用自動輪播
            autoRotateInterval: options.autoRotateInterval || 10000, // 10秒
            enableThumbs: options.enableThumbs !== false, // 默認顯示縮圖
            enableProgressiveBlur: options.enableProgressiveBlur !== false, // 默認啟用漸進模糊
            ...options
        };
        
        this.autoRotateTimer = null;
        this.currentIndex = 4; // 默認選中第4張圖片
        
        this.init();
    }

    init() {
        this.createHTML();
        this.bindEvents();
        
        if (this.options.autoRotate) {
            this.startAutoRotate();
        }
        
        // 設置默認選中
        this.switchBackground(this.currentIndex);
    }

    createHTML() {
        const container = this.options.container;
        
        // 創建背景插件容器
        const backgroundPlugin = document.createElement('div');
        backgroundPlugin.className = 'background-plugin';
        backgroundPlugin.innerHTML = `
            ${this.options.enableThumbs ? this.createThumbsHTML() : ''}
            ${this.options.enableProgressiveBlur ? this.createProgressiveBlurHTML() : ''}
            <div class="contenedor"></div>
        `;
        
        // 插入到容器的第一個位置
        container.insertBefore(backgroundPlugin, container.firstChild);
    }

    createThumbsHTML() {
        return `
 
        <div class="thumbs">
            <label><input type="radio" name="image"></label>
            <label><input type="radio" name="image"></label>
            <label><input type="radio" name="image"></label>
            <label><input type="radio" name="image"></label>
            <label><input type="radio" name="image"></label>
            <label><input type="radio" name="image"></label>
            <label><input type="radio" name="image"></label>
            <label><input type="radio" name="image"></label>
            <label><input type="radio" name="image"></label>
        </div>

        `;
    }

    createProgressiveBlurHTML() {
        return `
            <div class="progressive-blur">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        `;
    }

    bindEvents() {
        // 綁定縮圖點擊事件 - 直接綁定到label元素
        if (this.options.enableThumbs) {
            // 使用更長的延遲確保DOM完全載入
            setTimeout(() => {
                const labels = document.querySelectorAll('.thumbs label');
                console.log('找到label數量:', labels.length);
                
                labels.forEach((label, index) => {
                    // 為每個label添加點擊事件
                    label.addEventListener('click', (e) => {
                        console.log('點擊label:', index + 1);
                        
                        // 直接切換背景
                        this.switchBackground(index + 1);
                        
                        // 設置對應的radio button為checked
                        const radioButton = label.querySelector('input[type="radio"]');
                        if (radioButton) {
                            radioButton.checked = true;
                        }
                        
                        // 重啟自動輪播
                        this.restartAutoRotate();
                    });
                });
                
                // 設置初始狀態
                this.switchBackground(4); // 默認選中第4張
                
            }, 300); // 增加延遲時間
        }
    }

    // 切換到指定背景 (1-7)
    switchBackground(index) {
        if (index < 1 || index > 9) {
            console.error('背景索引超出範圍:', index);
            return;
        }
        
        const body = document.body;
        
        console.log('準備切換背景到:', index);
        console.log('當前body的classList:', body.classList.toString());
        
        // 移除所有背景類別
        for (let i = 1; i <= 9; i++) {
            body.classList.remove(`bg-${i}`);
        }
        
        // 添加新的背景類別
        body.classList.add(`bg-${index}`);
        
        console.log('切換後body的classList:', body.classList.toString());
        
        // 更新縮圖選中狀態
        this.updateThumbnailSelection(index);
        
        this.currentIndex = index;
        
        // 檢查CSS變數是否更新
        const bgValue = getComputedStyle(document.documentElement).getPropertyValue('--bg');
        console.log('當前--bg變數值:', bgValue);
    }
    
    // 更新縮圖選中狀態的視覺效果
    updateThumbnailSelection(selectedIndex) {
        const labels = document.querySelectorAll('.thumbs label');
        const radioButtons = document.querySelectorAll('.thumbs input[type="radio"]');
        
        labels.forEach((label, index) => {
            if (index + 1 === selectedIndex) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
        
        radioButtons.forEach((radio, index) => {
            radio.checked = (index + 1 === selectedIndex);
        });
    }

    // 隨機切換背景
    randomBackground() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * 9) + 1;
        } while (randomIndex === this.currentIndex);
        
        this.switchBackground(randomIndex);
    }

    // 下一張背景
    nextBackground() {
        const nextIndex = this.currentIndex >= 9 ? 1 : this.currentIndex + 1;
        this.switchBackground(nextIndex);
    }

    // 上一張背景
    prevBackground() {
        const prevIndex = this.currentIndex <= 1 ? 9 : this.currentIndex - 1;
        this.switchBackground(prevIndex);
    }

    // 隱藏/顯示縮圖控制器
    toggleThumbs(show = null) {
        const thumbs = document.querySelector('.thumbs');
        if (!thumbs) return;
        
        if (show === null) {
            thumbs.style.display = thumbs.style.display === 'none' ? 'flex' : 'none';
        } else {
            thumbs.style.display = show ? 'flex' : 'none';
        }
    }

    // 啟動自動輪播
    startAutoRotate() {
        if (!this.options.autoRotate) return;
        
        this.autoRotateTimer = setInterval(() => {
            this.randomBackground();
        }, this.options.autoRotateInterval);
    }

    // 停止自動輪播
    stopAutoRotate() {
        if (this.autoRotateTimer) {
            clearInterval(this.autoRotateTimer);
            this.autoRotateTimer = null;
        }
    }

    // 重啟自動輪播
    restartAutoRotate() {
        this.stopAutoRotate();
        if (this.options.autoRotate) {
            this.startAutoRotate();
        }
    }

    // 設置自動輪播間隔
    setAutoRotateInterval(interval) {
        this.options.autoRotateInterval = interval;
        if (this.autoRotateTimer) {
            this.restartAutoRotate();
        }
    }

    // 添加自定義背景圖片
    addCustomBackground(thumbnailUrl, fullSizeUrl) {
        // 這個功能需要更複雜的實現，暫時提供接口
        console.log('addCustomBackground 功能開發中...');
    }

    // 銷毀插件
    destroy() {
        this.stopAutoRotate();
        const backgroundPlugin = document.querySelector('.background-plugin');
        if (backgroundPlugin) {
            backgroundPlugin.remove();
        }
    }
}

// 創建全局API
window.BackgroundPlugin = {
    instance: null,
    
    // 初始化插件
    init: function(options = {}) {
        if (this.instance) {
            this.instance.destroy();
        }
        this.instance = new BackgroundPlugin(options);
        return this.instance;
    },

    // 快捷方法
    switchBackground: function(index) {
        if (this.instance) {
            this.instance.switchBackground(index);
        }
    },

    randomBackground: function() {
        if (this.instance) {
            this.instance.randomBackground();
        }
    },

    nextBackground: function() {
        if (this.instance) {
            this.instance.nextBackground();
        }
    },

    prevBackground: function() {
        if (this.instance) {
            this.instance.prevBackground();
        }
    },

    toggleThumbs: function(show) {
        if (this.instance) {
            this.instance.toggleThumbs(show);
        }
    },

    startAutoRotate: function() {
        if (this.instance) {
            this.instance.startAutoRotate();
        }
    },

    stopAutoRotate: function() {
        if (this.instance) {
            this.instance.stopAutoRotate();
        }
    },

    setAutoRotateInterval: function(interval) {
        if (this.instance) {
            this.instance.setAutoRotateInterval(interval);
        }
    }
};

// 兼容舊版本API
window.BackgroundPlugin.switchBackground = function(index) {
    if (this.instance) {
        this.instance.switchBackground(index);
    }
};

window.BackgroundPlugin.randomBackground = function() {
    if (this.instance) {
        this.instance.randomBackground();
    }
};

window.BackgroundPlugin.toggleThumbs = function(show) {
    if (this.instance) {
        this.instance.toggleThumbs(show);
    }
};

// DOM 加載完成後自動初始化
document.addEventListener('DOMContentLoaded', function() {
    // 檢查是否有背景插件的CSS
    const hasBackgroundCSS = Array.from(document.styleSheets).some(sheet => {
        try {
            return Array.from(sheet.cssRules || []).some(rule => 
                rule.selectorText && rule.selectorText.includes('.background-plugin')
            );
        } catch (e) {
            return false;
        }
    }) || document.querySelector('link[href*="background-plugin"]') !== null;

    if (hasBackgroundCSS) {
        // 自動初始化插件
        window.BackgroundPlugin.init({
            autoRotate: true,
            autoRotateInterval: 10000
        });
        console.log('Background Plugin 已自動初始化');
    }
});