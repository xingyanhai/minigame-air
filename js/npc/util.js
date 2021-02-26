export default class Util {
    static rnd(start, end) {
        return Math.floor(Math.random() * (end - start) + start)
    }
}
