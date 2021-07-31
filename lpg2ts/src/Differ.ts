
export abstract class Differ {
    public static I_CODE: number = 0;
    public static D_CODE: number = 1;
    public static R_CODE: number = 2;
    public static M_CODE: number = 3;
    public static MM_CODE: number = 4;
    public static IMI_CODE: number = 5;
    public static MI_CODE: number = 6;
    public static IM_CODE: number = 7;
    public static DMD_CODE: number = 8;
    public static MD_CODE: number = 9;
    public static DM_CODE: number = 10;
    public newStream: IPrsStream;
    public oldStream: IPrsStream;
    public insertCount: number = 0;
    public deleteCount: number = 0;
    public replaceDeleteCount: number = 0;
    public replaceInsertCount: number = 0;
    public moveCount: number = 0;
    public deleteRoot: Differ.Change = null;
    public insertRoot: Differ.Change = null;
    public replaceRoot: Differ.Change = null;
    public changeRoot: Differ.Change = null;
    public changeCount: number = 0;
    public extraCount: number = 0;
    public newStart: number;
    public oldStart: number;
    public newEnd: number;
    public oldEnd: number;
    public newBuffer: Differ.ILine[];
    public oldBuffer: Differ.ILine[];
    public newMap: java.util.HashMap = new java.util.HashMap();
    public newLink: Int32Array;
    public abstract getBuffer(stream: IPrsStream): Differ.ILine[];
    constructor() { }
    constructor(newStream: IPrsStream, oldStream: IPrsStream) {
        this.newStream = newStream;
        this.oldStream = oldStream;
        this.newBuffer = this.getBuffer(newStream);
        this.oldBuffer = this.getBuffer(oldStream);
        var i: number, k: number;
        for (i = 1; i < this.newBuffer.length && i < this.oldBuffer.length; i++) {
            if (!(this.newBuffer[i].equals(this.oldBuffer[i]))) {
                break;
            }
        }
        if (i == this.newBuffer.length && i == this.oldBuffer.length) {
            return;
        }
        this.newStart = i;
        this.oldStart = i;
        for (i = this.newBuffer.length - 1, k = this.oldBuffer.length - 1; i > this.newStart && k > this.oldStart; i--, k--) {
            if (!(this.newBuffer[i].equals(this.oldBuffer[k]))) {
                break;
            }
        }
        this.newEnd = i;
        this.oldEnd = k;
        this.newLink = new Int32Array(this.newBuffer.length);
        var tail: Int32Array = new Int32Array(this.newBuffer.length);
        for (i = 1; i < this.newBuffer.length; i++) {
            var line: Differ.ILine = this.newBuffer[i];
            var root: number = <number>this.newMap.get(line);
            if (root == null) {
                root = new number(i);
                this.newMap.put(line, root);
            } else {
                this.newLink[tail[root.intValue()]] = i;
            }
            tail[root.intValue()] = i;
        }
    }
    public min(x: number, y: number): number {
        return x < y ? x : y;
    }
    public getChangeCount(): number {
        return this.changeCount;
    }
    public getInsertCount(): number {
        return this.insertCount;
    }
    public getDeleteCount(): number {
        return this.deleteCount;
    }
    public getReplaceDeleteCount(): number {
        return this.replaceDeleteCount;
    }
    public getReplaceInsertCount(): number {
        return this.replaceInsertCount;
    }
    public getMoveCount(): number {
        return this.moveCount;
    }
    public compare(): void {
        if (this.newLink != null) {
            this.compare(this.oldStart, this.oldEnd, this.newStart, this.newEnd);
            this.findMoves();
            this.mergeChanges();
        }
        return;
    }
    public outputChanges(): void {
        for (var element: Differ.Change = this.changeRoot; element != null; element = element.getNext()) {
            if (element.getCode() == Differ.I_CODE) {
                this.outputInsert(element);
            } else {
                if (element.getCode() == Differ.D_CODE) {
                    this.outputDelete(element);
                } else {
                    if (element.getCode() == Differ.R_CODE) {
                        this.outputReplace(element);
                    } else {
                        if (element.getCode() == Differ.M_CODE) {
                            this.outputMove(element);
                        } else {
                            if (element.getCode() == Differ.MD_CODE) {
                                this.outputMoveDelete(element);
                            } else {
                                if (element.getCode() == Differ.MI_CODE) {
                                    this.outputMoveInsert(element);
                                } else {
                                    console.log("Don't know what to do with code " + element.getCode());
                                }
                            }
                        }
                    }
                }
            }
        }
        return;
    }
    public detach(buffer: Differ.ILine[], map: java.util.HashMap, link: Int32Array, start: number, end: number): void {
        for (var k: number = start; k <= end; k++) {
            var line: Differ.ILine = buffer[k];
            var root: number = <number>map.get(line);
            if (root != null) {
                var previous: number = 0;
                for (var i: number = root.intValue(); i != k && i != 0; previous = i, i = link[i]) {
                }
                if (previous == 0) {
                    var successor: number = link[root.intValue()];
                    if (successor == 0) {
                        map.remove(line);
                    } else {
                        map.put(line, new number(successor));
                    }
                } else {
                    link[previous] = link[k];
                }
            }
        }
        return;
    }
    public compareSections(olds: number, news: number, bound: number): boolean {
        for (var i: number = 0; i <= bound; i++) {
            if (!this.oldBuffer[olds + i].equals(this.newBuffer[news + i])) {
                return false;
            }
        }
        return true;
    }
    public addReplace(olds: number, olde: number, news: number, newe: number): void {
        this.changeCount++;
        this.detach(this.newBuffer, this.newMap, this.newLink, news, newe);
        for (var element: Differ.Change = this.replaceRoot, tail: Differ.Change = null; element != null; tail = element, element = element.getNext()) {
            var bound1: number = (element.getOlde() - element.getOlds()), bound2: number = (element.getNewe() - element.getNews());
            if (bound1 == (newe - news) && bound2 == (olde - olds)) {
                if (this.compareSections(element.getOlds(), news, bound1)) {
                    if (this.compareSections(olds, element.getNews(), bound2)) {
                        var change_element: Differ.Change = new Differ.Change(Differ.M_CODE, element.getOlds(), element.getOlde(), news, newe, this.changeCount);
                        change_element.setNext(this.changeRoot);
                        this.changeRoot = change_element;
                        element.setCode(Differ.M_CODE);
                        element.setOlds(olds);
                        element.setOlde(olde);
                        if (element == this.replaceRoot) {
                            this.replaceRoot = element.getNext();
                        } else {
                            tail.setNext(element.getNext());
                        }
                        element.setNext(this.changeRoot);
                        this.changeRoot = element;
                        return;
                    }
                }
            }
        }
        var element: Differ.Change = new Differ.Change(Differ.R_CODE, olds, olde, news, newe, this.changeCount);
        element.setNext(this.replaceRoot);
        this.replaceRoot = element;
        return;
    }
    public findMoves(): void {
        var i_element: Differ.Change, d_element: Differ.Change, previous_d: Differ.Change, previous_i: Differ.Change;
        for (i_element = this.insertRoot, previous_i = null; i_element != null && this.deleteRoot != null; previous_i = i_element, i_element = i_element.getNext()) {
            var bound: number = i_element.getNewe() - i_element.getNews();
            for (d_element = this.deleteRoot, previous_d = null; d_element != null; previous_d = d_element, d_element = d_element.getNext()) {
                if (bound == d_element.getOlde() - d_element.getOlds()) {
                    if (this.similarSections(d_element, i_element)) {
                        if (d_element == this.deleteRoot) {
                            this.deleteRoot = d_element.getNext();
                        } else {
                            previous_d.setNext(d_element.getNext());
                        }
                        break;
                    }
                }
            }
            if (i_element.getCode() != Differ.I_CODE) {
                if (i_element == this.insertRoot) {
                    this.insertRoot = i_element.getNext();
                } else {
                    previous_i.setNext(i_element.getNext());
                }
                i_element.setNext(this.changeRoot);
                this.changeRoot = i_element;
            }
        }
        for (d_element = this.deleteRoot, previous_d = null; d_element != null && this.insertRoot != null; previous_d = d_element, d_element = d_element.getNext()) {
            var bound: number = d_element.getOlde() - d_element.getOlds();
            if (bound >= 2) {
                for (i_element = this.insertRoot; i_element != null; previous_i = i_element, i_element = i_element.getNext()) {
                    if (bound < i_element.getNewe() - i_element.getNews()) {
                        if (this.deleteOverlap(d_element, i_element)) {
                            if (i_element == this.insertRoot) {
                                this.insertRoot = i_element.getNext();
                            } else {
                                previous_i.setNext(i_element.getNext());
                            }
                            break;
                        }
                    }
                }
                if (d_element.getCode() != Differ.D_CODE) {
                    if (d_element == this.deleteRoot) {
                        this.deleteRoot = d_element.getNext();
                    } else {
                        previous_d.setNext(d_element.getNext());
                    }
                    d_element.setNext(this.changeRoot);
                    this.changeRoot = d_element;
                }
            }
        }
        for (i_element = this.insertRoot, previous_i = null; i_element != null && this.deleteRoot != null; previous_i = i_element, i_element = i_element.getNext()) {
            var bound: number = i_element.getNewe() - i_element.getNews();
            if (bound >= 2) {
                for (d_element = this.deleteRoot, previous_d = null; d_element != null; previous_d = d_element, d_element = d_element.getNext()) {
                    if (bound < d_element.getOlde() - d_element.getOlds()) {
                        if (this.insertOverlap(d_element, i_element)) {
                            if (d_element == this.deleteRoot) {
                                this.deleteRoot = d_element.getNext();
                            } else {
                                previous_d.setNext(d_element.getNext());
                            }
                            break;
                        }
                    }
                }
            }
            if (i_element.getCode() != Differ.I_CODE) {
                if (i_element == this.insertRoot) {
                    this.insertRoot = i_element.getNext();
                } else {
                    previous_i.setNext(i_element.getNext());
                }
                i_element.setNext(this.changeRoot);
                this.changeRoot = i_element;
            }
        }
        return;
    }
    public compare(olds: number, olde: number, news: number, newe: number): void {
        if (olds > olde && news > newe) {
            return;
        }
        if (olds > olde) {
            this.changeCount++;
            var element: Differ.Change = new Differ.Change(Differ.I_CODE, olds, olde, news, newe, this.changeCount);
            element.setNext(this.insertRoot);
            this.insertRoot = element;
            this.detach(this.newBuffer, this.newMap, this.newLink, news, newe);
        } else {
            if (news > newe) {
                this.changeCount++;
                var element: Differ.Change = new Differ.Change(Differ.D_CODE, olds, olde, news, newe, this.changeCount);
                element.setNext(this.deleteRoot);
                this.deleteRoot = element;
            } else {
                var largest: number = 0, lolds: number = 0, lnews: number = 0;
                for (var oldi: number = olds; oldi + largest <= olde; oldi++) {
                    var image: number = <number>this.newMap.get(this.oldBuffer[oldi]);
                    if (image != null) {
                        for (var newi: number = image.intValue(); newi != 0 && oldi + largest <= olde; newi = this.newLink[newi]) {
                            if (newi >= news && newi + largest <= newe) {
                                if (this.oldBuffer[oldi + largest].equals(this.newBuffer[newi + largest])) {
                                    var bound: number = this.min(newe - newi, olde - oldi), i: number;
                                    for (i = 1; i <= bound; i++) {
                                        if (!this.oldBuffer[oldi + i].equals(this.newBuffer[newi + i])) {
                                            break;
                                        }
                                    }
                                    if (i > largest) {
                                        largest = i;
                                        lolds = oldi;
                                        lnews = newi;
                                    }
                                }
                            }
                        }
                    }
                }
                if (largest > 0) {
                    this.detach(this.newBuffer, this.newMap, this.newLink, lnews, lnews + largest - 1);
                    this.compare(olds, lolds - 1, news, lnews - 1);
                    this.compare(lolds + largest, olde, lnews + largest, newe);
                } else {
                    this.addReplace(olds, olde, news, newe);
                }
            }
        }
        return;
    }
    public similarSections(d_element: Differ.Change, i_element: Differ.Change): boolean {
        var map: java.util.HashMap = new java.util.HashMap();
        var link: Int32Array = new Int32Array(this.newBuffer.length), tail: Int32Array = new Int32Array(this.newBuffer.length);
        var bound: number = d_element.getOlde() - d_element.getOlds();
        if (this.compareSections(d_element.getOlds(), i_element.getNews(), bound)) {
            for (var i: number = d_element.getOlds(); i <= d_element.getOlde(); i++) {
                if (!(this.oldBuffer[i].size() == 0)) {
                    i_element.setCode(Differ.M_CODE);
                    i_element.setOlds(d_element.getOlds());
                    i_element.setOlde(d_element.getOlde());
                    this.extraCount++;
                    return true;
                }
            }
            return false;
        }
        for (var i: number = i_element.getNews(); i <= i_element.getNewe(); i++) {
            var line: Differ.ILine = this.newBuffer[i];
            var root: number = <number>map.get(line);
            if (root == null) {
                root = new number(i);
                map.put(line, root);
            } else {
                link[tail[root.intValue()]] = i;
            }
            tail[root.intValue()] = i;
        }
        var largest: number = -1, newi: number = 0;
        bound = 0;
        var image: number = <number>map.get(this.oldBuffer[d_element.getOlds()]);
        if (image != null) {
            for (var j: number = image.intValue(); j != 0; j = link[j]) {
                bound = i_element.getNewe() - j;
                if (this.compareSections(d_element.getOlds(), j, bound)) {
                    if (bound > largest) {
                        largest = bound;
                        newi = j;
                    }
                }
            }
        }
        this.detach(this.newBuffer, map, link, i_element.getNews(), i_element.getNewe());
        if (largest >= 0) {
            i_element.setTemp(bound);
            var oldi: number = d_element.getOlds() + bound + 1;
            bound = d_element.getOlde() - oldi;
            if (this.compareSections(oldi, i_element.getNews(), bound)) {
                i_element.setCode(Differ.MM_CODE);
                i_element.setOlds(d_element.getOlds());
                i_element.setOlde(d_element.getOlde());
                i_element.setTemp(oldi);
                i_element.setTemp2(newi);
                return true;
            }
        }
        return false;
    }
    public insertOverlap(d_element: Differ.Change, i_element: Differ.Change): boolean {
        var map: java.util.HashMap = new java.util.HashMap();
        var link: Int32Array = new Int32Array(this.oldBuffer.length), tail: Int32Array = new Int32Array(this.oldBuffer.length);
        for (var i: number = d_element.getOlds(); i <= d_element.getOlde(); i++) {
            var line: Differ.ILine = this.oldBuffer[i];
            var root: number = <number>map.get(line);
            if (root == null) {
                root = new number(i);
                map.put(line, root);
            } else {
                link[tail[root.intValue()]] = i;
            }
            tail[root.intValue()] = i;
        }
        var oldi: number = 0, bound: number = i_element.getNewe() - i_element.getNews();
        var image: number = <number>map.get(this.oldBuffer[i_element.getNews()]);
        if (image != null) {
            for (oldi = image.intValue(); oldi != 0; oldi = link[oldi]) {
                if (d_element.getOlde() - oldi >= bound) {
                    if (this.compareSections(oldi, i_element.getNews(), bound)) {
                        break;
                    }
                }
            }
        }
        this.detach(this.oldBuffer, map, link, d_element.getOlds(), d_element.getOlde());
        if (oldi != 0) {
            if (oldi == d_element.getOlds()) {
                this.extraCount++;
                i_element.setCode(Differ.MD_CODE);
            } else {
                if (d_element.getOlde() == oldi + bound) {
                    i_element.setCode(Differ.DM_CODE);
                } else {
                    i_element.setCode(Differ.DMD_CODE);
                }
            }
            i_element.setTemp(oldi);
            i_element.setTemp2(d_element.getNewe());
            i_element.setOlds(d_element.getOlds());
            i_element.setOlde(d_element.getOlde());
            return true;
        }
        return false;
    }
    public deleteOverlap(d_element: Differ.Change, i_element: Differ.Change): boolean {
        var map: java.util.HashMap = new java.util.HashMap();
        var link: Int32Array = new Int32Array(this.newBuffer.length), tail: Int32Array = new Int32Array(this.newBuffer.length);
        for (var i: number = i_element.getNews(); i <= i_element.getNewe(); i++) {
            var line: Differ.ILine = this.newBuffer[i];
            var root: number = <number>map.get(line);
            if (root == null) {
                root = new number(i);
                map.put(line, root);
            } else {
                link[tail[root.intValue()]] = i;
            }
            tail[root.intValue()] = i;
        }
        var bound: number = d_element.getOlde() - d_element.getOlds(), newi: number = 0;
        var image: number = <number>map.get(this.oldBuffer[d_element.getOlds()]);
        if (image != null) {
            for (newi = image.intValue(); newi != 0; newi = link[newi]) {
                if (i_element.getNewe() - newi >= bound) {
                    if (this.compareSections(d_element.getOlds(), newi, bound)) {
                        break;
                    }
                }
            }
        }
        this.detach(this.newBuffer, map, link, i_element.getNews(), i_element.getNewe());
        if (newi != 0) {
            if (newi == i_element.getNews()) {
                this.extraCount++;
                d_element.setCode(Differ.MI_CODE);
            } else {
                if (i_element.getNewe() == newi + bound) {
                    d_element.setCode(Differ.IM_CODE);
                } else {
                    d_element.setCode(Differ.IMI_CODE);
                }
            }
            d_element.setTemp(newi);
            d_element.setTemp2(i_element.getOlde());
            d_element.setNews(i_element.getNews());
            d_element.setNewe(i_element.getNewe());
            return true;
        }
        return false;
    }
    public mergeChanges(): void {
        var change: Differ.Change[] = new Array<Differ.Change>(this.changeCount + 1);
        var slot_used: boolean[] = [];
        for (var element: Differ.Change = this.insertRoot; element != null; element = element.getNext()) {
            change[element.getNumber()] = element;
            slot_used[element.getNumber()] = true;
        }
        for (var element: Differ.Change = this.deleteRoot; element != null; element = element.getNext()) {
            change[element.getNumber()] = element;
            slot_used[element.getNumber()] = true;
        }
        for (var element: Differ.Change = this.replaceRoot; element != null; element = element.getNext()) {
            change[element.getNumber()] = element;
            slot_used[element.getNumber()] = true;
        }
        for (var element: Differ.Change = this.changeRoot; element != null; element = element.getNext()) {
            change[element.getNumber()] = element;
            slot_used[element.getNumber()] = true;
        }
        this.changeRoot = null;
        for (var i: number = this.changeCount; i >= 1; i--) {
            if (slot_used[i]) {
                if (change[i].getCode() == Differ.MM_CODE) {
                    var element: Differ.Change = new Differ.Change(Differ.M_CODE, change[i].getOlds(), change[i].getTemp() - 1, change[i].getTemp2(), change[i].getNewe(), change[i].getNumber());
                    element.setNext(this.changeRoot);
                    this.changeRoot = element;
                    change[i].setCode(Differ.M_CODE);
                    change[i].setOlds(change[i].getTemp());
                    change[i].setNewe(change[i].getTemp2() - 1);
                } else {
                    if (change[i].getCode() == Differ.DM_CODE) {
                        var element: Differ.Change = new Differ.Change(Differ.M_CODE, change[i].getTemp(), change[i].getOlde(), change[i].getNews(), change[i].getNewe(), change[i].getNumber());
                        element.setNext(this.changeRoot);
                        this.changeRoot = element;
                        change[i].setCode(Differ.D_CODE);
                        change[i].setOlde(change[i].getTemp() - 1);
                        change[i].setNewe(change[i].getTemp2());
                    } else {
                        if (change[i].getCode() == Differ.DMD_CODE) {
                            var element: Differ.Change = new Differ.Change(Differ.MD_CODE, change[i].getTemp(), change[i].getOlde(), change[i].getNews(), change[i].getNewe(), change[i].getNumber());
                            element.setNext(this.changeRoot);
                            this.changeRoot = element;
                            change[i].setCode(Differ.D_CODE);
                            change[i].setOlde(change[i].getTemp() - 1);
                            change[i].setNewe(change[i].getTemp2());
                        } else {
                            if (change[i].getCode() == Differ.IM_CODE) {
                                var element: Differ.Change = new Differ.Change(Differ.M_CODE, change[i].getOlds(), change[i].getOlde(), change[i].getTemp(), change[i].getNewe(), change[i].getNumber());
                                element.setNext(this.changeRoot);
                                this.changeRoot = element;
                                change[i].setCode(Differ.I_CODE);
                                change[i].setNewe(change[i].getTemp() - 1);
                                change[i].setOlde(change[i].getTemp2());
                            } else {
                                if (change[i].getCode() == Differ.IMI_CODE) {
                                    var element: Differ.Change = new Differ.Change(Differ.MI_CODE, change[i].getOlds(), change[i].getOlde(), change[i].getTemp(), change[i].getNewe(), change[i].getNumber());
                                    element.setNext(this.changeRoot);
                                    this.changeRoot = element;
                                    change[i].setCode(Differ.I_CODE);
                                    change[i].setNewe(change[i].getTemp() - 1);
                                    change[i].setOlde(change[i].getTemp2());
                                }
                            }
                        }
                    }
                }
                change[i].setNext(this.changeRoot);
                this.changeRoot = change[i];
            }
        }
        this.changeCount -= this.extraCount;
        return;
    }
    public abstract outputInsert(element: Differ.Change): void;
    public abstract outputDelete(element: Differ.Change): void;
    public abstract outputReplace(element: Differ.Change): void;
    public abstract outputMove(element: Differ.Change): void;
    public abstract outputMoveDelete(element: Differ.Change): void;
    public abstract outputMoveInsert(element: Differ.Change): void;
}
; export module Differ {
    ; export interface ILine {
        hashCode(): number;
        equals(anObject: any): boolean;
        size(): number;
        getStartLine(): number;
        getStartColumn(): number;
        getEndLine(): number;
        getEndColumn(): number;
    }

    ; export class Change {
        private number: number;
        private olds: number;
        private olde: number;
        private news: number;
        private newe: number;
        private code: number;
        private temp: number;
        private temp2: number;
        private next: Differ.Change;
        constructor(code: number, olds: number, olde: number, news: number, newe: number, number: number) {
            this.code = code;
            this.olds = olds;
            this.olde = olde;
            this.news = news;
            this.newe = newe;
            this.number = number;
        }
        public getCode(): number {
            return this.code;
        }
        public getOlds(): number {
            return this.olds;
        }
        public getOlde(): number {
            return this.olde;
        }
        public getNews(): number {
            return this.news;
        }
        public getNewe(): number {
            return this.newe;
        }
        public getNumber(): number {
            return this.number;
        }
        public getTemp(): number {
            return this.temp;
        }
        public getTemp2(): number {
            return this.temp2;
        }
        public getNext(): Differ.Change {
            return this.next;
        }
        public setCode(code: number): void {
            this.code = code;
        }
        public setOlds(olds: number): void {
            this.olds = olds;
        }
        public setOlde(olde: number): void {
            this.olde = olde;
        }
        public setNews(news: number): void {
            this.news = news;
        }
        public setNewe(newe: number): void {
            this.newe = newe;
        }
        public setNumber(number: number): void {
            this.number = number;
        }
        public setTemp(temp: number): void {
            this.temp = temp;
        }
        public setTemp2(temp2: number): void {
            this.temp2 = temp2;
        }
        public setNext(next: Differ.Change): void {
            this.next = next;
        }
    }
}
;
