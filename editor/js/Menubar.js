import { UIPanel } from './libs/ui.js';
import { MenubarFile } from './Menubar.File.js';
import { MenubarEdit } from './Menubar.Edit.js';
import { MenubarAdd } from './Menubar.Add.js';
import { MenubarView } from './Menubar.View.js';
import { MenubarHelp } from './Menubar.Help.js';
import { MenubarStatus } from './Menubar.Status.js';
import { MenubarScreenshot } from './Menubar.Screenshot.js'; // Новый импорт

function Menubar( editor ) {

    const container = new UIPanel();
    container.setId( 'menubar' );

    container.add( new MenubarFile( editor ) );
    container.add( new MenubarEdit( editor ) );
    container.add( new MenubarAdd( editor ) );
    container.add( new MenubarView( editor ) );
    container.add( new MenubarHelp( editor ) );

    container.add( new MenubarScreenshot( editor ) ); // Добавляем новую кнопку Screenshot

    container.add( new MenubarStatus( editor ) );

    return container;

}

export { Menubar };
