export default class Slab_new
{   
    #data_model;
    #data = {};
    #data_memory = {};
    #instance = '';
    
    /**
     * functions with only 1 parameter
     * (object with data or undefined)
     * @param {function} html 
     * @param {function} css 
     * @param {function} events
     */
    constructor(html, css, events)
    {
        this.html = html;
        this.css = css;
        this.events = events;
    }
    
    /**
     * 
     * @param {function} data_model 
     */
    init_data(data_model)
    {
        this.#data_model = data_model;
        this.refresh_data();
        this.data_memory();
        this.listen_data_changes();
    }

    refresh_data(){ this.#data = this.#data_model(); }

    data_memory()
    {
        for(let key in this.#data)
        {
            this.#data_memory[key] = JSON.stringify(this.#data[key]);
        }
    }

    get_data(){ return this.#data; }
    
    listen_data_changes(){
        let This = this;
        setInterval(()=>{
            //if data change in backend side modify in frontend
            this.refresh_data();
            let work_app_data = '';

            /* if new value different of old value
             * refresh slab concerned  */
            for(let key in this.#data_memory)
            {
                //object to json string to compare with memory
                work_app_data = JSON.stringify(this.#data[key]);

                if(this.#data_memory[key]!==work_app_data)
                {
                    // if new value different of old value : refresh slab...
                    this.refreshHtml(this.#data)
                    .styleHtml(this.#data)
                    .mobilizeHtml(this.#data);
                    console.warn(`${this.#instance}.${key} data modified`);

                    //... and refresh memory  */
                    this.#data_memory[key] = work_app_data;
                }
            }
        },250);
    }

    isAllContained(htmlCode)
    {
        let counter = -1;
        let all_tag_like_first_one = [];
        let first_tag_type = htmlCode.trim()
        .match(/<\w+\s*/)[0]
        .replace(/[<\s]/g,'');
        let final_tag = '</'+first_tag_type+'>';

        //first test the first and last tag type are the same
        if(!htmlCode.trim().endsWith(final_tag))
        {
            throw new Error('A slab must be contained in unique tag')
        }

        //second test all code contained in unique tag
        all_tag_like_first_one = htmlCode.trim().match(RegExp(`</*${first_tag_type}`,'g'));
        for(let elmt of all_tag_like_first_one)
        {
            if(counter===0){ throw new Error('A slab must be contained in unique tag'); }
            else if(counter===-1){ counter=0; }
            if(/<\w/.test(elmt)){ counter++; }
            else/*if(/<\//.elmt(test))*/{ counter--; }
        }
        return true;
    }

    identifyHtml(slab_instance_name, htmlCode)
    {
        //let last_offset = 0;
        return htmlCode.replace(/<\w+\s*/,function(match, offset){
            //last_offset = offset;
            return `${match} slabid-container="${slab_instance_name}" `;
        });
    }

    insertHtml(slab_instance_name, data)
    {
        let htmlCode = this.identifyHtml(slab_instance_name, this.html(data));
        
        //check if all contained in unique tag //TO DEBUGG
        this.isAllContained(htmlCode);

        $('#slapp').append(htmlCode);return this;
    }

    
    styleHtml(data)
    {
        if(this.css == undefined){ return this; }
        
        for(let selector in this.css(data))
        {
            $(selector).css(this.css(data)[selector]);
        }

        return this;
    }

    mobilizeHtml(data)
    {
        if(this.events == undefined){ return this; }
        
        for(let selector in this.events(data))
        {
            //console.log(selector)
            //console.log(this.events(data)[selector][0] + " -- " + this.events(data)[selector][1]);
            $(selector).on(this.events(data)[selector][0], this.events(data)[selector][1]);
        }

        return this;
    }

    refreshHtml(data)
    {
        $(`[slabid-container="${this.#instance}"]`).replaceWith( this.identifyHtml(this.#instance, this.html(data)) );
        return this;
    }

    /**
     * 
     * @param {string} slab_instance_name 
     * @param {function} data_model 
     * @returns 
     */
    insert_version(slab_instance_name, data_model)
    {
        /*check if the name of slab is not already used by other slab
        if(this.#instances.includes(slab_instance_name))
        { throw new Error(`'${slab_instance_name}' is already inserted. Change name or refresh ${slab_instance_name}`) }
        */

        //memorize the slab name
        this.#instance = slab_instance_name;

        //initialize data_model (in this.#data)
        this.init_data(data_model);

        this.insertHtml(slab_instance_name, this.#data).styleHtml(this.#data).mobilizeHtml(this.#data);
        console.log(`%cSlab ${slab_instance_name} inserted in slapp %c`,"color:#7864ff");

        return this;
    }

    new_data_model(classModel)
    {
        this.data_model = classModel;
    }
}