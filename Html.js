export default class Html
{
    ends = [];
    export = '';

    constructor(tag=false, attr={})
    {
        switch(tag)
        {
            case '_':
            case '__':
            case 'save':
            case 'tag':
            case 'text':
            case 'html':
            case 'end':
                return this;
        }
        if(tag!==false){ this[tag](attr); }
    }
    
    /**
     * data = {
     *  _tag: string,
     *  _end: bool,
     * _text: string,
     *  attr_name: string
     * }
     * @param {Object} data 
     * @returns [tag, end tag]
     */
    tag(data, close='>')
    {
        let attributs = '';
        let result_tag = [];

        for(let x in data)
        {
            if(x[0]!='_')
            {
                attributs += (data[x]!='') ? ` ${x}="${data[x]}"` : ` ${x}`;
            }
        }

        result_tag.push(`<${data._tag}${attributs}${close}`);
        if(data._text!=undefined && data._text!=''){ result_tag.push(data._text); }
        else{ result_tag.push(undefined); }
        if(data._end!=undefined && data._end){ result_tag.push(`</${data._tag}>`); }
        else{ result_tag.push(undefined); }
        return result_tag;
    }

    save(tag)
    {
        this.export += tag[0]
        if(tag[1]!==undefined){ this.export += tag[1]; }
        if(tag[2]!==undefined){ this.ends.push(tag[2]); }
        return this;
    }  

    text(text){ this.export += text; return this; }
    html(html){ return this.text(html); }
    /**
     * create data.length html code from the html_model
     * using data[x]
     * @param {object[]} data 
     * @param {function} html_model 
     * @param {object} object_complement 
     * @returns string html code
     */
    htmlist(data, html_model, object_complement=false)
    {   
        let html_content = '';
        let temp_data = '';

        data.forEach(function(val){
            temp_data = (object_complement!==false) 
                        ? Object.assign({}, object_complement,val)
                        : val;
            html_content += html_model(temp_data);
        });
        return this.text(html_content);
    }

    //double tags
    __(tag, attr)
    { 
        return this.save( this.tag( Object.assign(attr, {_tag:tag, _end:true}) ,'>') );
    }
    a(attr={}){ return this.__('a', attr) }
    audio(attr={}){ return this.__('audio', attr) }
    b(attr={}){ return this.__('b', attr) }
    btn(attr={}){ return this.__('button', attr) }
    canvas(attr={}){ return this.__('canvas', attr) }
    div(attr={}){ return this.__('div', attr) }
    form(attr={}){ return this.__('form', attr) }
    h1(attr={}){ return this.__('h1', attr) }
    h2(attr={}){ return this.__('h2', attr) }
    h3(attr={}){ return this.__('h3', attr) }
    h4(attr={}){ return this.__('h4', attr) }
    h5(attr={}){ return this.__('h5', attr) }
    label(attr={}){ return this.__('label', attr) }
    li(attr={}){ return this.__('li', attr) }
    nav(attr={}){ return this.__('nav', attr) }
    p(attr={}){ return this.__('p',attr) }
    span(attr={}){ return this.__('span', attr) }
    table(attr={}){ return this.__('table', attr) }
    tbody(attr={}){ return this.__('tbody', attr) }
    td(attr={}){ return this.__('td', attr) }
    textarea(attr={}){ return this.__('textarea', attr) }
    th(attr={}){ return this.__('th', attr) }
    tr(attr={}){ return this.__('tr', attr) }
    ul(attr={}){ return this.__('ul', attr) }

    //simple tags
    _(tag, attr={}, close='>')
    {
        if(typeof(attr)==='number' && attr>0)
        {
            for(let i =0; i<attr; i++)
            {
                this._(tag, {}, close);
            }
            return this;
        }
        else if(typeof(all)==='number')
        {
            console.error(`Html.${tag}(negative_number): not allowed`);
            return this;
        }
        return this.save(  this.tag( Object.assign(attr, {_tag:tag, _end:false}), close )  );
    }
    br(attr={}, close='>'){ return this._('br',attr,close) }
    hr(attr={}, close='>'){ return this._('hr',attr,close) }
    img(attr={}, close='>'){ return this._('img',attr,close) }
    input(attr={}, close='>'){ return this._('input',attr,close) }
    source(attr={}, close='>'){ return this._('source',attr,close) }

    

    end(all='')
    {
        let max = this.ends.length;

        if(max==0)
        {
            console.warn('No more tag open, remove Html.end()');
            return this;
        }

        if(typeof(all)==='number' && all>0)
        {
            let curr_module = {};
            for(let i = 0; i<all; i++)
            {
                curr_module = this.end();
                if(curr_module.ends.length==0)
                {
                    console.warn('Html.end(): Too more end of tag. Remaining end() functions ommited.');
                    return this;
                }
            }

            return this;
        }
        else if(typeof(all)==='number')
        {
            console.error('Html.end(negative_number): not allowed');
            return this;
        }

        for(let i = 0; i<max; i++)
        {
            this.export += this.ends.pop();
            if(all!=='all'){ return this; }
        }

        return this;
    }
}