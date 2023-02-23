const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (e) => {
    var body = JSON.parse( e.body );
    console.log( body );
    
    
    const configuration = new Configuration({
      apiKey: 'YOUR OPENAI KEY',
    });
    const openai = new OpenAIApi(configuration);
    
    var prompt = body.action;
    
  
    
    var resp = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 2500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    var answer = resp.data.choices[0].text;
    console.log(answer);

    // RETURN REPONSE
    const response = {
        statusCode: 200,
        body: answer
    };
    
    return response;
};
