#!/usr/bin/env bash
if [ $# -lt 3 ]
    then
    echo "Miss argument(s): ./slab action slabname 'slablevel letter'"
    echo "You write only $# parameter(s)."
elif [ $1 != 'new' ]
    then
    echo "'$1' action unknown. Do you want to say 'new' ?"
elif [[ $3 =~ [^a-zA-Z] ]]
    then
    echo "Parameter 3 only a letter from A to Z. Yours: $3"
else
    #replace all spaces by _
    slab=${2// /_}
    #toUpperCase letter
    cat=$(echo "$3" | tr '[:lower:]' '[:upper:]')
    #vars to work
    new_files=("$slab.events.js" "$slab.html.js" "$slab.style.js" "$slab.js" "$slab.scss")
    default_files=("eventsjs" "htmljs" "stylejs" "js" "scss")
    repo="$cat-$slab"
    temp_content=""

    mkdir ../../view_slab/"$repo"

    for ((i = 0 ; i < ${#new_files[@]} ; i++))
    do
    #write the default file in variable
    temp_content=$(cat ./default_files/"${default_files[$i]}") 
    #echo this content replacing 'slabName' by the name of slabe given by the user
    #in slab directory of the the project
    echo -e "${temp_content//slabName/"$slab"}" > ../../view_slab/"$repo/${new_files[$i]}"
    done
fi
