// kony temenos quantum 


onHide: function test(){ 
    if(this.view.id=="btnToHide")
   {
       this.view.btnToHide.skin="SkinBtnHide";
       this.view.btnToHide.setEnabled(false)                      
    }
    else
    {
        this.view.btnToHide.skin="SkinBtnShow";
        this.view.btnToHide.setEnabled(true)

        this.view.btnToHide.onClick = function(){
            alert("Hello");
        }

       

        this.view.btnToHide.view
    };


    onClickBtnChangeBackground: function test2 () {
        this.view.btnWithBackground.backgroundImage= "imgButton.png";
        this.view.btnWithBackground.skin="SkinBtnHide";
        this.view.btnWithBackground.setEnabled(false);   
        
      }

      
};

onNavigateDataToAnotherForm: function test3 (){
    
    const ntf = new kony.mvc.Navigation("frm4InfoDataForUser");

    // ntf.navigate({
    //     "name": "John",
    //     "age": 30,
    //     "address": "New York"
    // });

	const myObj = {"name": "John"};

	ntf.navigate(myObj);

   

    ntf.navigate(); 

}


 // Work of Radio Button widget
 onSelectionRadioButton: function (){
   
    
    
    this.view.radioBtnForForm3.masterData = [
      ["user1", "value1"],
      ["user2", "value2"],
     ["user3", "value3"]
     ];
     this.view.radioBtnForForm3.selectedKey = "user3"; 
      

   
   
   
 }
   

