export class Sidebar {
    private container: HTMLElement | null;

    constructor() {
        this.container = document.querySelector('.sidebar-l');
    }

    public init(): void {
        console.log("BMS: Inicializace sidebaru..."); // Tuhle hlášku musíš vidět v konzoli
        if (!this.container) {
            console.error("BMS: Kontejner .sidebar-l nebyl nalezen!");
            return;
        }
        console.log("BMS: Sidebar Mod ready.");
        this.bindEvents();
    }

    private bindEvents(): void {
        const items = this.container?.querySelectorAll('.song-item');
        items?.forEach(item => {
            item.addEventListener('click', () => {
                console.log("Kliknuto na položku v sidebaru");
            });
        });
    }
}