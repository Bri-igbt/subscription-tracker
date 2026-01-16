import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Subscription Name is required' ] ,
        trim: true,
        minlength: [2, 'Subscription Name must be at least 3 characters'],
        maxlength: [100, 'Subscription Name must be less than 50 characters']
    },
    price: { 
        type: Number, 
        required: [true, 'Subscription Price is required' ],
        min: [0, 'Subscription Price must be at least 0']
    },
    currency: { 
        type: String, 
        enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CNY'],
        default: 'USD'
    },
    frequency: { 
        type: String, 
        enum: ['monthly', 'yearly', 'weekly', 'daily'],
    },
    category: { 
        type: String, 
        enum: ['entertainment', 'productivity', 'education', 'health', 'other'],
        required: [true, 'Subscription Category is required' ]
    },
    paymentMethod: { 
        type: String, 
        required: [true, 'Payment Method is required' ],
        trim: true,
    },
    status: { 
        type: String, 
        enum: ['active', 'canceled', 'expired'],
        default: 'active'
    },
    startDate: { 
        type: Date, 
        required: [true, 'Subscription Start Date is required' ],
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start Date must be in the past'
        },
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'Renewal Date must be after Start Date'
        }
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'Subscription must be associated with a User' ],
        index: true,
    },

}, { timestamps: true });

// Auto-calculate renewal date if missing
subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]); 
    }

// Auto-update the status if renewal date has passed 
    if(this.renewalDate < new Date()) {
        this.status = 'expired'
    }

    next();
});

const Subscription = mongoose.model( 'Subscription', subscriptionSchema )

export default Subscription