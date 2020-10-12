let activeTab = null;
function setUpMenu() {
    document.querySelectorAll('.menu-icon').forEach((el) => {
        function activateTab(id) {
            activeTab = document.getElementById(id);
            activeTab.style.display = 'flex';
        } 
    
        function killActiveTab() {
            if (activeTab) {
                activeTab.style.display = 'none';
                activeTab = null;
            }
        }
    
        function openMenu(id) {
            if (!activeTab) {
                activateTab(id);
                gsap.to('#menu', {
                    duration: .2,
                    ease: 'linear',
                    x: "0%",
                });
            }
        }
    
        function closeMenu() {
            if (activeTab) {
                gsap.to('#menu', {
                    duration: .2,
                    ease: 'linear',
                    x: "100%",
                    onComplete: () => { killActiveTab(); }
                });
            }
        }
        
        el.addEventListener('click', function() {
            if (!activeTab) {
                openMenu(this.id + '-menu');
            } else {
                if (activeTab.id.startsWith(this.id)) {
                    closeMenu();
                } else {
                    killActiveTab();
                    activateTab(this.id + '-menu');
                }
            }
        });

        document.getElementsByClassName('app-container')[0].addEventListener('click', closeMenu);
    });
}



