import React from "react";

const MicroList = (props) => {

  return (
    <div className='radio'>
      <label>
        <input onChange={() => props.updateInfo('pageSelect', 'Gcloud')} type="radio"
          value="Gcloud" checked={props.pageSelect === 'Gcloud'} />
        <img id="Gcloudimg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png" />
      </label>
      <label>
        <input onChange={() => props.updateInfo('pageSelect', 'Lambda')} type="radio"
          value="Lambda" checked={props.pageSelect === 'Lambda'} />
        <img id="Lambdaimg" src="https://git.teknik.io/POTM/Mirror-script.module.lambdascrapers/raw/commit/25b20d0adb8afa6d29eba3a0167046cb2e21ea94/icon.png" />
      </label>
      <label>
        <input onChange={() => props.updateInfo('pageSelect', 'Docker')} type="radio"
          value="Docker" checked={props.pageSelect === 'Docker'} />
        <img src="https://cdn.iconscout.com/icon/free/png-256/docker-7-569438.png" />
      </label>
      <label>
        <input onChange={() => props.updateInfo('pageSelect', 'Azure')} type="radio"
          value="Azure" checked={props.pageSelect === 'Azure'} />
        <img src="https://abouttmc.com/wp-content/uploads/2019/02/logo_azure.png" />
      </label>
    </div>
  );
}

export default MicroList;