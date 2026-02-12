
class CustomerModel {
    constructor(customer) {
        this.customer_name = customer.customer_name;
        this.email = customer.email;
        this.phone = customer.phone;
        this.address = customer.address;
        this.isActive = customer.is_active;
        this.createdBy = customer.created_by;
        this.terms = customer.terms;
    }
}

export default CustomerModel;
