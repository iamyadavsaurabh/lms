import {clerkClient} from '@clerk/express';

// Midldleware to protect educator routes so only authenticated users can access them
export const protectEducator = async (req,res,next) => {

    try {
        const userId = req.auth.userId // Get user ID from the request object
        
        const response = await clerkClient.users.getUser(userId) // Get user details from Clerk that user is educator or not

        if (response.publicMetadata.role !== 'educator') {
            return res.json({success:false, message: 'Unauthorized Access'})
        }
        
        next()  // If user is an educator, proceed to the next middleware or route handler
    } 
    catch (error) {
        res.json({success:false, message: error.message})
    }

}