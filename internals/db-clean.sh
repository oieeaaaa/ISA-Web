while true; do
    read -p "WARNING: This will wipe out the entire database, do you wish to proceed?" yn
    case $yn in
        [Yy]* )
            dropdb 'ask';
            create db 'ask';
            yarn prisma:update;
          break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done
