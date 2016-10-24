# Bresenham's Line Derivation

Another way to derive the line drawing algorithm is incrementally.

Let's start with a "dumb" line drawing.

```
 for x = X0 to X1
   putpixel( x, y )
```

Unfortunately this just draws a horizontal line. :-/  What we want is this:

```
 for x = X0 to X1
   putpixel( x, y )
   figure out new y
```

Sometimes we increment y, sometimes we don't:

```
 for x = X0 to X1
   putpixel( x, y )
   if( incrementY )
      y = y + 1
```

If we use floating-point this becomes easy if we keep track of the error:

```
 e = 0;
 m = dy/dx;
 for x = X0 to X1
   putpixel( x, y )
   e += m;
   if (e > 0.5)
      e = e - 1
      y = y + 1
```

We want to get rid of that 0.5 and use integers

```
 e = 0;
 m = 2*dy/dx;
 for x = X0 to X1
   putpixel( x, y )
   e += m;
   if (e > 1)
      e = e - 2
      y = y + 1
```

We also want to get rid of that division -- we need to multiply all the terms by dx; this means all terms involving m need to be updated:

```
 e = 0;
 m = 2*dy;
 for x = X0 to X1
   putpixel( x, y )
   e += m;
   if (e > dx)
      e = e - 2*dx
      y = y + 1
```

We also want to compare the sign instead of 'e > dx' -- we can change that by offsetting the initial term.

```
 e = -dx;
 m = 2*dy;
 for x = X0 to X1
   putpixel( x, y )
   e += m;
   if (e > 0)
      e = e - 2*dx
      y = y + 1
```




