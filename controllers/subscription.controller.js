import Subscription from '../models/subscription.model.js';
import mongoose from 'mongoose';
import { workflowClient } from '../configs/upstash.js'
import { SERVER_URL } from '../configs/env.js';

//create a new subscription
export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
        ...req.body,
        user: req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
        url: `${SERVER_URL}/api/workflows/subscription/reminder`,
        body: {
            subscriptionId: subscription.id,
        },
        headers: {
            'content-type': 'application/json',
        },
        retries: 0,
        })

        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (e) {
        next(e);
    }
}

//get subscriptions for a specific user
export const getUserSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.id) {
            const error = new Error('Unauthorized access to subscriptions');
            error.status = 40;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({
            success: true,
            data: subscriptions,
        });

    } catch (error) {
        next(error);
    }
};

//get all subscriptions
export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};

// Get Subscription By Id
export const getSubscriptionById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findOne({
            _id: id,
            user: req.user._id, 
        });

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

// Update Subscription By Id
export const updateSubscriptionById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findOneAndUpdate(
            { _id: id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

// Delete Subscription By Id
export const deleteSubscriptionById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findOneAndDelete({
            _id: id,
            user: req.user._id,
        });

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "Subscription deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Cancel Subscription
export const cancelSubscriptionById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { status: 'canceled' },
            { new: true }
        );

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

// Renew Subscription
export const renewSubscriptionById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error("Invalid subscription ID");
            error.statusCode = 400;
            throw error;
        }

        const subscription = await Subscription.findOne({ 
            _id: id, 
            user: req.user._id 
        });

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        if(subscription.status === 'canceled') {
            const error = new Error("Cannot renew a canceled subscription");
            error.statusCode = 400;
            throw error;
        }

        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        const newRenewalDate = new Date(subscription.renewalDate);
        newRenewalDate.setDate(newRenewalDate.getDate() + renewalPeriods[subscription.frequency]);

        subscription.renewalDate = newRenewalDate;
        subscription.status = 'active';

        await subscription.save();

        res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

// Get Upcoming Renewals
export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const subscriptions = await Subscription.find({
            user: req.user._id,
            renewalDate: { $gte: now, $lte: nextWeek },
        });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
};
