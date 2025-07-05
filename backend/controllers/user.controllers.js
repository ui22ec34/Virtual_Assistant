
import geminiResponse from '../gemini.js';
import User from '../models/user.model.js';
import moment from 'moment/moment.js';

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage: imageUrl,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Update Assistant Error" });
  }
};


export const askToAssistant = async (req,res)=>{
  try {
    const {command} = req.body

    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;
    const result = await geminiResponse(command,assistantName,userName)

    const jsonMatch = result.match(/{[\s\S]*}/)
    if(!jsonMatch){
      return res.status(400).json({response:"Sorry! I Don't Understand"})
    }
    const gemResult = JSON.parse(jsonMatch[0])
    const type = gemResult.type

    switch(type){
      case 'get-date' : 
      return res.json({
        type,
        userInput : gemResult.userInput,
        response : `current date is ${moment().format("YYYY-MM-DD")}`
      })
      case 'get-time' : 
      return res.json({
        type,
        userInput : gemResult.userInput,
        response : `current time is ${moment().format("hh:mm A")}`
      })
      case 'get-day' : 
      return res.json({
        type,
        userInput : gemResult.userInput,
        response : `today is ${moment().format("dddd")}`
      })
      case 'get-month' : 
      return res.json({
        type,
        userInput : gemResult.userInput,
        response : `current month is ${moment().format("MMMM")}`
      })
      case 'google-search':
      case 'youtube-search':
      case 'youtube-play':
      case 'general':
      case 'calculator-open':
      case 'instagram-open':
      case 'facebook-open':
      case 'weather-show':
        return res.json({
          type,
          userInput : gemResult.userInput,
          response : gemResult.response,
        })

        default :
        return res.status(400).json({response:"Sorry! I didn't get the Command."})
    }
  } catch (error) {
    return res.status(500).json({response: "Ask Assistant Error."})
    
  }
}