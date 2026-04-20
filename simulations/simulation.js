function onClickSimulationSettingsButton(){
    let element = document.getElementsByClassName("simulation-settings-panel")[0];
    const display = element.style.display
    if (display === "none" || element.style.display === ""){
        element.style.display = "block";
    }
    else{
        element.style.display = "none";
    }
}