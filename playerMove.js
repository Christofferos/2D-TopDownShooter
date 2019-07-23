// Written in GameMaker 2 Language. It is NOT a js code file.

NOTE:
  Most code was written as state objects.These, however are locked behind subscription costs and could therefore not get ahold of them.

This is just a small preview of all the game code.


/*


BEGIN MOVE


*/

// Rotation of Player
image_angle = point_direction(x, y, mouse_x, mouse_y);
var distance_bullet_travels = 0;

step_dx = 0;
step_dy = 0;

// Recoil
firingdelay -= 1;
recoil = max(0, recoil - 2);

#
region Pistolskott #1

	if (mouse_check_button(mb_left)) && (firingdelay < 0)
	{
		if (currentAmmo > 0)
		{

			if (equipped = = gun.pistol) {
  audio_sound_pitch(snShoot, choose(1.25, 1.5, 1.75));
  audio_play_sound(snShoot, 2, false);

  recoil = 3;
  firingdelay = 10;
  ScreenShake(0.8, 7) // 1.5 och 10 vanligtvis

  with(instance_create_layer((random_range(x + 10, x - 10)), (random_range(y + 10, y - 10)), "Bullets", oBullet)) {
    speed = 15;
    direction = other.image_angle + random_range(-2, 2);
    image_angle = direction;
  }
} else if (equipped == gun.shotgun) {
  audio_sound_pitch(snShoot, choose(0.1, 0.2, 0.3));
  audio_play_sound(snShoot, 4, false);

  recoil = 10;
  firingdelay = 15;
  ScreenShake(1.8, 10) // 1.5 och 10 vanligtvis

  //var count = 0;
  with(instance_create_layer(x, y, "Bullets", oBullet_Shotgun)) {
    alarm[2] = room_speed * 12;
    speed = 12;
    direction = other.image_angle + random_range(-3, 3);
    image_angle = direction - 90;

    if (distance_bullet_travels == 1)
      instance_deactivate_object(oBullet_Shotgun);
  }

} else if (equipped == gun.sniper) {
  audio_sound_pitch(snShoot, 2.5);
  audio_play_sound(snShoot, 2, false);

  recoil = 7;
  firingdelay = 20;
  ScreenShake(3.0, 5) // 1.5 och 10 vanligtvis

  with(instance_create_layer(x, y, "Bullets", oBullet_Sniper)) // Lägg till att man måste stå still för att skjuta
  {
    speed = 15;
    direction = other.image_angle + random_range(-0.2, 0.2);
    image_angle = direction;
    if instance_exists(oBullet_Sniper)
    image_speed = 2.5;
  }
}

currentAmmo--;
}
}

#
endregion

# region Pistolskott #2 (Not active)
# endregion

// Recoil
step_dx -= lengthdir_x(recoil, image_angle);
step_dy -= lengthdir_y(recoil, image_angle);

#
region(Misc
  for dash - mechanic(history))# endregion





/*


MOVE UPDATE


*/


// Get player input
pause_key = keyboard_check_pressed(vk_escape);
// After Menuing is done
if (hascontrol) {
  #
  region Calculate Movement
  key_left = keyboard_check(vk_left) || keyboard_check(ord("A"));
  key_right = keyboard_check(vk_right) || keyboard_check(ord("D"));
  key_up = keyboard_check(vk_up) || keyboard_check(ord("W"));
  key_down = keyboard_check(vk_down) || keyboard_check(ord("S"));
  key_space = keyboard_check(vk_space);
  key_right_mouse = mouse_check_button_pressed(mb_right);

  move_h = key_right - key_left; // x-axis
  move_v = key_down - key_up; // y-axis

  hsp = move_h * walksp;
  vsp = move_v * walksp;

  step_dx += hsp;
  step_dy += vsp;

  #
  endregion

  # region Dash - function
  if (hsp > 0 || hsp < 0 || vsp < 0 || vsp > 0) {
    if (Can_Dash) {
      if (key_space) {
        Can_Dash = false;
        energy = 0;
        alarm[1] = room_speed * 1.0;




        len = walksp * 8; //8 vanligt
        dir = point_direction(0, 0, move_h, move_v);
        hsp = lengthdir_x(len, dir);
        vsp = lengthdir_y(len, dir);

        if (position_empty(x + hsp * 2, y)) {
          x += hsp;
        }
        if (position_empty(x, y + vsp * 2)) {
          y += vsp;
        }

        // Create the dash effect (behind player)
        var dash = instance_create_layer(x, y, "Player", oDash_Effect);
        dash.sprite_index = sprite_index;
        //dash.image_index = image_index;
        dash.image_angle = point_direction(x, y, mouse_x, mouse_y);

        audio_play_sound(snLanding, 4, false);
      }
    }
  }#
  endregion

  # region Melee Attack
  if (key_right_mouse && canMeleeAttack == 1) {
    /*
    image_speed = 40;
    sprite_index = sPlayer_Right_Slash;
    image_angle = point_direction(x ,y, mouse_x, mouse_y);
    alarm[3] = room_speed*10;
    */
    canMeleeAttack = 0;
    alarm[3] = room_speed * 0.2;

    direction = point_direction(x, y, mouse_x, mouse_y);
    var xdiff = x + lengthdir_x(35, direction);
    var ydiff = y + lengthdir_y(35, direction);
    if (!(xdiff == 0 && ydiff == 0)) {
      delta_x = xdiff;
      delta_y = ydiff;
    }

    with(instance_create_layer(delta_x, delta_y, "Bullets", oHitbox)) {
      if instance_exists(oHitbox)
      sHitbox2.image_speed = 50;
      image_angle = point_direction(x, y, mouse_x, mouse_y);
    }
  }

  #
  endregion

  # region Pick up weapon...(still in development phase)

  if (keyboard_check_pressed(ord("E")))
    if (point_distance(x, y, oPickup_Gun.x + 16, oPickup_Gun.y + 16) < 40) {
      if (secondary == -1) {
        secondary = oPickup_Gun.name;
      } else {
        if (equipped == primary) {
          primary = oPickup_Gun.name;
        } else {
          secondary = oPickup_Gun.name;

          var temp = equipped;
          equipped = oPickup_Gun.name;

          // drop our gun in place of the pickup
          oPickup_Gun.name = temp;
        }
      }
    }

  # endregion

  # region Swaping Weapons

  //if (distance_to_object(oShotgun) < 40)
  //{
  if (keyboard_check_pressed(ord("Q"))) {
    if (equipped == primary) {
      equipped = secondary;
      sprite_index = sPlayer_Right_Shotgun;

    } else if (equipped == secondary) {
      equipped = thrid; //primary;
      sprite_index = sPlayer_Right_Sniper;

    } else if (equipped == thrid) {
      equipped = primary;
      sprite_index = sPlayer_Right;

    }

    //else
    //{
    // FILL
    //}
    currentAmmo = ammo[equipped];
  }
  //}

  #
  endregion

  # region Collision

  /*
  	var new_x = x + step_dx;
  	var new_y = y + step_dy;

  	if (!place_meeting(new_x, new_y, oWall))
  	{
  		x = new_x;
  		y = new_y
  	}
  */

  var w = 44; //44 width
  var h = 44; //44 height

  var step_dx_with_margin = sign(step_dx) * (abs(step_dx) + w / 2);
  var step_dy_with_margin = sign(step_dy) * (abs(step_dy) + h / 2);


  var wall_id = noone;

  if (wall_id == noone)
    wall_id = collision_point(x + step_dx - w / 2, y + step_dy - h / 2, oWall, true, false);

  if (wall_id == noone)
    wall_id = collision_point(x + step_dx + w / 2, y + step_dy - h / 2, oWall, true, false);

  if (wall_id == noone)
    wall_id = collision_point(x + step_dx - w / 2, y + step_dy + h / 2, oWall, true, false);

  if (wall_id == noone)
    wall_id = collision_point(x + step_dx + w / 2, y + step_dy + h / 2, oWall, true, false);


  if (wall_id != noone) {
    var dx1 = scr_collision(x, step_dx, w / 2, wall_id.bbox_left);
    var dx2 = scr_collision(x, step_dx, w / 2, wall_id.bbox_right);
    var dy1 = scr_collision(y, step_dy, h / 2, wall_id.bbox_bottom);
    var dy2 = scr_collision(y, step_dy, h / 2, wall_id.bbox_top);
    step_dx = sign(step_dx) * min(abs(dx1), abs(dx2));
    step_dy = sign(step_dy) * min(abs(dy1), abs(dy2));
  }
  x = x + step_dx;
  y = y + step_dy;

  #
  endregion

  # region Animaiton
  //Animation
  if (hsp == 0 && vsp == 0 && mouse_check_button(mb_left) == 0) {
    image_speed = 0;
  } else
    image_speed = 0.8;#
  endregion
} else {
  key_left = 0;
  key_right = 0;
  key_up = 0;
  key_down = 0;
  key_space = 0;
}


#
region Damage Animation(when being hit by an enemy)
image_alpha = hp / hpmax;

if (hp <= 0) {
  game_restart();
}#
endregion