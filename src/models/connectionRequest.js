import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status:{
        type: String,
        enum: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is not a valid status`,
        required: true,
    }
}, {timestamps: true})

connectionRequestSchema.pre('save', async function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
      throw new Error('You cannot send connection request to yourself!');
    }
    next();
});

const ConnectionRequestModel = mongoose.model('ConnectionRequestModel', connectionRequestSchema);
export default ConnectionRequestModel;