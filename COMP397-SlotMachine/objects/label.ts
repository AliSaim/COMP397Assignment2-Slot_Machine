module objects {
    export class Label extends createjs.Text {
        constructor(labelTextg: string, x: number, y: number, centered: boolean) {
            super(labelTextg, config.FONT_SMALL + " " +
                config.FONT_FAMILY, config.BLACK);

            if (centered) {
                this.regX = this.getMeasuredWidth() * 0.5;
                this.regY = this.getMeasuredHeight() * 0.5;
            }
            this.y = y;
            this.x = x;

        
        }
    }
}