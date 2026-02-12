
class MaterialModel {
    constructor(material) {
        this.material_name = material.material_name;
        this.material_grade = material.material_grade;
        this.density = material.density;
        this.unit = material.unit;
        this.current_price = material.current_price;
        this.description = material.description;
        this.remark = material.remark;
    }
}

class MaterialTypeModel {
    constructor(type) {
        this.type_name = type.type_name;
        this.description = type.description;
        this.remark = type.remark;
    }
}

class MaterialLinkModel {
    constructor(link) {
        this.material_id = link.material_id;
        this.material_type_id = link.material_type_id;
        this.current_price = link.current_price;
        this.remark = link.remark;
    }
}

export { MaterialModel, MaterialTypeModel, MaterialLinkModel };
