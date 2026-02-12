
class MachineryMasterModel {
    constructor(data) {
        this.name = data.name;
        this.main_category_id = data.main_category_id;
        this.description = data.description;
    }
}

class MachinerySubCategoryModel {
    constructor(data) {
        this.category_id = data.category_id;
        this.subcategory_name = data.subcategory_name;
        this.description = data.description;
    }
}

class ProcessPricingModel {
    constructor(data) {
        this.material_id = data.material_id;
        this.process_id = data.process_id;
        this.minutes = data.minutes;
        this.unit = data.unit;
        this.rate = data.rate;
        this.is_manual_rate = data.is_manual_rate;
        this.note = data.note;
        this.remark = data.remark;
    }
}

export { MachineryMasterModel, MachinerySubCategoryModel, ProcessPricingModel };
