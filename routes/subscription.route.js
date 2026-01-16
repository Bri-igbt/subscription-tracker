import { Router } from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
    res.send({ message: 'Get all subscriptions'});
});

subscriptionRouter.get('/:id', (req, res) => {
    res.send({ message: 'Get subscription details' });
});

subscriptionRouter.post('/', (req, res) => {
    res.send({ message: 'Create a new subscription' });
});

subscriptionRouter.put('/:id', (req, res) => {
    res.send({ message: 'Update subscription details' });
});

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({ message: 'Delete a subscription' });
})

subscriptionRouter.get('/user/:id', (req, res) => {
    res.send({ message: 'Get subscriptions for a specific user' });
});

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({ message: 'Cancel a subscription' });
});

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({ message: 'Get upcoming renewals' });
});


export default subscriptionRouter;