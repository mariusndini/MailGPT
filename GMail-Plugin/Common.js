
/**
 * INTRO THE APPLICATION 
 * CALLED FROM: "runFunction": "createCard"
   Creates the initial card
   Returns the card to be displayed within the application itself
 */
   function createCard(e) {

      var instructions = CardService.newTextParagraph()
        .setText(`MailGPT helps you write better EMails.`);
    
    var instructions2 = CardService.newTextParagraph()
        .setText(`Provide your Email draft then ask MailGPT for help or to provide an opinion.`);
    
    
      var bodyInput = CardService.newTextInput()
        .setFieldName("body_input")
        .setTitle("📧 EMail Draft.")
        .setHint("Type your email draft here for MailGPT to best assist you.")
        .setMultiline(true);
    
      var helpInput = CardService.newTextInput()
        .setFieldName("help_input")
        .setTitle("🧭 How Can MailGPT Help?")
        .setHint("Ask whether your email is professional or MailGPT can write a poem. Give MailGPT guidance on how to best help.")
        .setMultiline(true);
    
      var action = CardService.newAction()
          .setFunctionName('doPost');
    
      var sendButton = CardService.newTextButton()
          .setText('🧠 GO!')
          .setOnClickAction(action)
          .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
    
      // Create a footer to be shown at the bottom.
      var footer = CardService.newFixedFooter()
          .setPrimaryButton(CardService.newTextButton()
              .setText('Powered by chatGPT')
              .setOpenLink(CardService.newOpenLink()
                  .setUrl('https://chat.openai.com/chat')));
    
    
    
    
      // Assemble the widgets and return the card.
      var section = CardService.newCardSection()
          .addWidget(instructions)
          .addWidget(instructions2)
          .addWidget(bodyInput)
          .addWidget(helpInput)
          .addWidget(sendButton);
    
      var card = CardService.newCardBuilder()
          .addSection(section)
          .setFixedFooter(footer);
    
      return card.build();
    }
    
    /**
     * on change
     */
    function onChange(e) {
      console.log(e);
    }
    
    
    /**
     * POST CALL to ChatGPT hosted API
     * post call to the hosted API
     */
    function doPost(e) {
      var data = {};
      data.action = e.formInput.help_input + " " +  e.formInput.body_input;
      data.instruction = 'Make this email professional'
    
      var options = {
        'method' : 'post',
        'contentType': 'application/json',
        'payload' : JSON.stringify(data) // Convert the JavaScript object to a JSON string.
      };
    
      var post = UrlFetchApp.fetch('YOUR HTTP API INTERFACE WITH CHATGPT', options);
      
      //OPENAI'S ANSWER IS SAVED HERE AND THEN VISUALIZED TO THE USER
      var answer = post.toString().trim();
    
      var returnInput = CardService.newTextInput()
        .setFieldName("resp_input")
        .setTitle("Please Review & Edit the Response Below")
        .setHint("The above result was generated. Please review and edit as necessary prior to sending to your recipients.")
        .setValue( answer )
        .setMultiline(true);
    
    
    var subjectInput = CardService.newTextInput()
        .setFieldName("email_subject")
        .setTitle("Email Subject");
    
      var composeAction = CardService.newAction().setFunctionName('composeEmail');
    
      var composeEmail = CardService.newTextButton()
          .setText('Create Draft')
          .setOnClickAction(composeAction)
          .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
    
      var section = CardService.newCardSection()
          .addWidget(returnInput)
          .addWidget(subjectInput)
          .addWidget(composeEmail);
      
      var card = CardService.newCardBuilder()
          .addSection(section);
    
      return card.build();
    
    }
    
    
    /**
     * COMPOSE DRAFT EMAIL
     * Creates a draft email with the provided subject and ChatGPT's response
     */
    
    function composeEmail(e) {
        var accessToken = e.messageMetadata.accessToken;
        GmailApp.setCurrentMessageAccessToken(accessToken);
    
        var recipient = e.formInput.recipient;
        var subject = e.formInput.email_subject;
        var body = e.formInput.resp_input;
    
        var draft = GmailApp.createDraft(recipient, subject, body);
        return CardService.newComposeActionResponseBuilder()
            .setGmailDraft(draft).build();
    }
    
    
    
    
    
    