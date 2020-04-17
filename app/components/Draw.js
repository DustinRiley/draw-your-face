import React, {Component} from 'react'
import WebViewer, { PDFNet } from '@pdftron/webviewer'



export default class Draw extends Component {
    constructor(props){
        super(props)
    }

    createTimeStampAnnot(Annotations, text, docViewer){
        let x = docViewer.getPageWidth(0)
        let y = docViewer.getPageHeight(0)
        
        let textContents = text? text : 'No Edits'
        let freeText = new Annotations.FreeTextAnnotation();
        freeText.PageNumber = 1;
        freeText.Width = 150;
        freeText.Height = 25;
        freeText.X = x - freeText.Width
        freeText.Y = y -freeText.Height
        freeText.setPadding(new Annotations.Rect(0, 0, 0, 0));
        freeText.FontSize = '12pt';
        freeText.FillColor = new Annotations.Color(0, 255, 255);
        freeText.setContents(textContents);
        freeText.NoMove ='true'
        freeText.Id= 'timeStamp'
        freeText.Locked =true;
        freeText.ReadOnly;
        return freeText;

    }

    getTimeStamp(anotList){
        console.log(anotList.find(annot=> annot.Id==='timeStamp'))
        return anotList.find(annot=> annot.Id==='timeStamp')
    }

    componentDidMount(){
        let self = this;
        let userData = JSON.parse(localStorage.getItem(this.props.user))
        let savedAnots;
        let backgroundImg =self.props.img;
        if(userData){
            savedAnots = userData.annots;   
        }

        WebViewer({
            path: '/public/webviewer',
            initialDoc: backgroundImg
          }, document.getElementById('viewer'))
            .then(instance => {
                
              //disable other editing tools  
            instance.disableTools();
            instance.enableTools(['AnnotationCreateFreeHand'])
    

            const docViewer = instance.docViewer;
            const annotManager = instance.annotManager;
            const Annotations = instance.Annotations;
            let freeText = new Annotations.FreeTextAnnotation();

     
            
           
            
            //Add Back button and save button
            instance.setHeaderItems(header => {
                header.unshift({
                    type: 'actionButton',
                    img: 'https://cdn.iconscout.com/icon/free/png-256/back-arrow-1767515-1502579.png',
                    onClick: ()=>{
                        self.props.setUser();
                    }
                })
                header.push({
                    type: 'actionButton',
                    img: 'https://www.brandeps.com/icon-download/S/Save-icon-vector-03.svg',
                    onClick: ()=>{
                       // annotManager.redrawAnnotation(freeText);
                        const doc = docViewer.getDocument();
                        annotManager.exportAnnotations()
                            .then((xfdfString)=>{
                                localStorage.setItem(self.props.user, JSON.stringify({annots: xfdfString, img:self.props.img}))
                                return doc.getFileData({                                  
                                })
                            })
                            .then(data=>{
                                const arr = new Uint8Array(data);
                                const blob = new Blob([arr], { type: 'application/pdf' });
                                alert('Document has been saved')
                            })
                    }
                })
            })
        
              docViewer.on('documentLoaded', () => {

                //if no saved annotations create a new one
                if(!savedAnots){  
                   freeText.getLeft();
                   freeText = self.createTimeStampAnnot(Annotations, 'No Edits', docViewer );
                   annotManager.addAnnotation(freeText);
                   annotManager.redrawAnnotation(freeText);
                }
                else{ 
                    annotManager.importAnnotations(savedAnots);
                    
                    let oldFreeText = self.getTimeStamp(annotManager.getAnnotationsList());
                    freeText = oldFreeText;
                    freeText.NoMove ='true'
                    freeText.Id= 'timeStamp'
                    freeText.Locked =true;
                    freeText.ReadOnly;
                    annotManager.addAnnotation(freeText);
                    annotManager.redrawAnnotation(freeText);
               }
                // on annotations changed update time stamp
                annotManager.on('annotationChanged', (annotations) => {
                    //if no time stamp exists create one
                    if(!self.getTimeStamp(annotManager.getAnnotationsList())){
                        annotManager.addAnnotation(freeText);
                        freeText = self.createTimeStampAnnot(Annotations)
                    }
                    let date = new Date();
                    freeText.setContents( date.toLocaleString());
                    annotManager.redrawAnnotation(freeText);
                   });
              });


          
               const CoreControls = instance.CoreControls;
               const Tools = instance.Tools;
              
            });
    }
    
    
    render(){
        return(   
        <div id='viewer'><p>Logged into: {this.props.user}</p></div>
        )
    }
}