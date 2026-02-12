
class QuotationModel {
    constructor(data) {
        this.quotation_number = data.quotation_number;
        this.customer_id = data.customer_id;
        this.customer_name = data.customer_name;
        this.our_drawing_ref = data.our_drawing_ref;
        this.customer_drawing_ref = data.customer_drawing_ref;
        this.drawing_desc = data.drawing_desc;
        this.contact_person = data.contact_person;
        this.enquiry_number = data.enquiry_number;
        this.enquiry_date = data.enquiry_date;
        this.quotation_date = data.quotation_date;
        this.valid_till = data.valid_till;
        this.currency = data.currency;
        this.remark = data.remark;
        this.created_by = data.created_by;
    }
}

class QuotationLineModel {
    constructor(data) {
        this.quotation_id = data.quotation_id;
        this.line_number = data.line_number;
        this.drawing_description = data.drawing_description;
        this.drawing_number = data.drawing_number;
        this.material_grade = data.material_grade;
        this.unit_price = data.unit_price;
        this.no_of_units = data.no_of_units;
        this.total_price = data.total_price;
    }
}

export { QuotationModel, QuotationLineModel };
