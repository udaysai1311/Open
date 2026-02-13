
class CustomerModel {
    constructor(customer) {
        this.customer_name = customer.customer_name;
        this.customer_abbr = customer.customer_abbr;
        this.contact_person = customer.contact_person;
        this.contact_person_designation = customer.contact_person_designation;
        this.email = customer.email;
        this.phone = customer.phone;
        this.address = customer.address;
        this.isActive = customer.is_active;
        this.createdBy = customer.created_by;
        this.terms = customer.terms;
    }
}

export default CustomerModel;
