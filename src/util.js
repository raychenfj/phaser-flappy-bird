export default class Util {
    static center(object, parent) {
        this.hcenter(object, parent);
        this.vcenter(object, parent);
    }

    static hcenter(object, parent) {
        object.x = (parent.width - object.width) / 2;
    }

    static vcenter(object, parent) {
        object.y = (parent.height - object.height) / 2;
    }
}